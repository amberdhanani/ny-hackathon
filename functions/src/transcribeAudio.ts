import { Request, Response } from "express";
import fs from "fs";
import OpenAI from "openai";
import Busboy from "busboy";
import path from "path";
import os from "os";
import { context } from "./context";

export const handleTranscription = async (req: Request, res: Response) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  console.log("🔹 Incoming request to /transcribe");

  if (!req.headers["content-type"]?.includes("multipart/form-data")) {
    console.log("❌ Invalid content type");
    return res.status(400).json({ error: "Invalid content type" });
  }

  try {
    console.log("🟡 Reading full request body...");
    const bodyBuffer = Buffer.from(req.body);
    console.log(`📦 Total request body size: ${bodyBuffer.length} bytes`);

    const { filePath, fileName } = await processFile(bodyBuffer, req.headers);

    if (!filePath) {
      console.log("❌ No valid file received.");
      return res.status(400).json({ error: "No file uploaded." });
    }

    console.log(`🚀 Sending file "${fileName}" to OpenAI for transcription...`);

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
    const titlePrompt = `Generate a concise and engaging 5-10 word title for the following transcript: ${formattedTranscript}`;
    const titleResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: context },
        { role: "user", content: titlePrompt },
      ],
    });

    const title = titleResponse.choices?.[0]?.message?.content?.trim() ?? "Untitled Transcript";

    console.log("✅ Title generated:", title);

    const analysisPrompt = `Analyze the following transcript and identify any segments that contain fixed mindset language. Return your results as raw json in the format explained in the system context. If you find any, please provide details on which parts exhibit a fixed mindset and explain why. Transcript: "${formattedTranscript}"`;

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
    console.log("title", title);
    return res.json({ transcript: formattedTranscript, title, analysis: cleanedAnalysis, duration });
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
    let fileName = "unknown_file.webm";
    let mimeType = "audio/webm";

    console.log("🟡 Parsing file using Busboy...");

    busboy.on(
      "file",
      (_fieldname: string, file: NodeJS.ReadableStream, filename: unknown, _encoding: string, mimetype: string) => {
        if (typeof filename === "string") {
          fileName = filename.trim();
        } else {
          console.warn("⚠️ Warning: filename is not a string, using default.");
        }

        mimeType = typeof mimetype === "string" ? mimetype.trim() : "audio/webm";
        console.log(`📂 File detected: ${fileName} (Type: ${mimeType})`);

        filePath = path.join(os.tmpdir(), fileName);
        const writeStream = fs.createWriteStream(filePath);

        file.pipe(writeStream);

        writeStream.on("finish", () => {
          console.log(`✅ File saved to: ${filePath}`);
          resolve({ filePath, fileName, mimeType });
        });

        writeStream.on("error", (error) => {
          console.error("❌ File write error:", error);
          reject(new Error(`File writing failed: ${error.message}`));
        });
      },
    );

    busboy.on("error", (error: any) => reject(new Error(`File upload failed: ${error.message}`)));
    busboy.end(bodyBuffer);
  });
};
