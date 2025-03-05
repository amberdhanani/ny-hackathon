import { Request, Response } from "express";
import fs from "fs";
import OpenAI from "openai";
import Busboy from "busboy";
import path from "path";
import os from "os";
import ffmpeg from "fluent-ffmpeg"; // Import FFmpeg
import { context } from "./context";

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

const convertToMp3 = (inputPath: string, outputPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat("mp3")
      .audioCodec("libmp3lame")
      .on("end", () => {
        console.log(`🎵 Conversion successful: ${outputPath}`);
        resolve(outputPath);
      })
      .on("error", (error) => {
        console.error("❌ Error during conversion:", error);
        reject(error);
      })
      .save(outputPath);
  });
};

export const handleTranscription = async (req: Request, res: Response) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  console.log("🔹 Incoming request to /transcribe");

  if (!req.headers["content-type"]?.includes("multipart/form-data")) {
    console.log("❌ Invalid content type");
    return res.status(400).json({ error: "Invalid content type" });
  }

  try {
    console.log("🟡 Reading full request body...");
    const bodyBuffer = (req as RawBodyRequest).rawBody || Buffer.from(req.body);
    console.log(`📦 Total request body size: ${bodyBuffer.length} bytes`);

    let { filePath, fileName, mimeType } = await processFile(bodyBuffer, req.headers);

    if (!filePath) {
      console.log("❌ No valid file received.");
      return res.status(400).json({ error: "No file uploaded." });
    }

    // 🔹 Convert M4A to MP3 before sending to OpenAI
    if (mimeType === "audio/m4a") {
      const convertedFilePath = filePath.replace(".m4a", ".mp3");
      try {
        await convertToMp3(filePath, convertedFilePath);
        filePath = convertedFilePath; // Update file path to mp3
        mimeType = "audio/mp3"; // Change mime type to mp3
      } catch (error) {
        console.error("❌ Failed to convert file:", error);
        return res.status(500).json({ error: "File conversion failed." });
      }
    }

    console.log(`🚀 Sending file "${fileName}" (${mimeType}) to OpenAI for transcription...`);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });

    console.log("✅ Transcription received:", transcription);

    const words = transcription.words ?? [];
    if (words.length === 0) {
      console.warn("⚠️ Warning: No words detected in the transcript.");
      return res.json({
        transcript: "No speech detected.",
        analysis: "No speech detected.",
        title: "No speech detected.",
      });
    }

    const formattedTranscript = words
      .map((word: any) => word.word)
      .join(" ")
      .replace(/\s([.,!?])/g, "$1");
    const duration = words.length > 0 ? Math.ceil(words[words.length - 1].end) : 0;

    console.log("Formatted Transcript:", formattedTranscript);

    // Generate a title for the transcript
    const titlePrompt = `Generate a concise, engaging, and natural-language title (5-10 words max) for the following transcript. Return only the title text with no additional formatting, explanations, or JSON output: ${formattedTranscript}`;
    const titleResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: context },
        { role: "user", content: titlePrompt },
      ],
    });

    const titleRaw = titleResponse.choices?.[0]?.message?.content?.trim() ?? "Untitled Transcript";

    const cleanTitle = (text: string) => {
      return text
        .replace(/[`{}[\]]/g, "")
        .trim()
        .slice(0, 100);
    };

    const title = cleanTitle(titleRaw);

    console.log("✅ Title generated:", title);

    const analysisPrompt = `Analyze the following transcript and identify any segments that contain fixed mindset language. Return your results as raw json in the format explained in the system context. If you find any, please provide details on which parts exhibit a fixed mindset and explain why. Make sure to return all sentences, even if they don't have a flag. Transcript: "${formattedTranscript}"`;

    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: context },
        { role: "user", content: analysisPrompt },
      ],
    });

    const cleanJsonString = (jsonString: string) => {
      return jsonString
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    };

    const analysisResponseText = analysisResponse.choices?.[0]?.message?.content?.trim() ?? "Analysis not available.";

    const cleanedAnalysis = cleanJsonString(analysisResponseText);

    console.log("✅ Analysis received:", cleanedAnalysis);

    return res.json({ transcript: formattedTranscript, title, duration, analysis: cleanedAnalysis });
  } catch (error: unknown) {
    console.error("❌ Error processing request:", (error as Error).message);
    return res.status(500).json({ error: (error as Error).message || "Internal Server Error" });
  }
};

const processFile = async (
  bodyBuffer: Buffer,
  headers: any,
): Promise<{ filePath: string | null; fileName: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line new-cap
    const busboy = Busboy({ headers });

    let filePath: string | null = null;
    let fileExtension = "webm"; // Default for Chrome
    let mimeType = "audio/webm";
    let fileName = "";

    busboy.on("file", (_fieldname, file, fileInfo) => {
      const { filename, mimeType: detectedMimeType } = fileInfo;

      console.log(`📂 Raw File Info - Filename: ${filename}, Detected MIME Type: ${detectedMimeType}`);

      if (typeof filename === "string") {
        fileName = filename.trim();
      } else {
        console.warn("⚠️ Warning: filename is not a string, using default.");
        fileName = "unknown_file";
      }

      if (detectedMimeType.includes("audio/mp4")) {
        fileExtension = "m4a";
        mimeType = "audio/m4a";
      } else if (detectedMimeType.includes("audio/webm")) {
        fileExtension = "webm";
        mimeType = "audio/webm";
      } else {
        console.warn(`⚠️ Warning: Unsupported MIME type detected: ${detectedMimeType}. Defaulting to webm.`);
        fileExtension = "webm";
        mimeType = "audio/webm";
      }

      fileName = `unknown_file.${fileExtension}`;
      console.log(`📂 Final File Name: ${fileName}, MIME Type: ${mimeType}`);

      filePath = path.join(os.tmpdir(), fileName);
      const writeStream = fs.createWriteStream(filePath);

      file.pipe(writeStream);

      writeStream.on("finish", () => {
        console.log(`✅ File saved successfully: ${filePath}`);
        resolve({ filePath, fileName, mimeType });
      });

      writeStream.on("error", (error) => {
        console.error("❌ File write error:", error);
        reject(new Error(`File writing failed: ${error.message}`));
      });
    });

    busboy.on("error", (error) => reject(new Error(`File upload failed: ${(error as Error).message}`)));
    busboy.end(bodyBuffer);
  });
};
