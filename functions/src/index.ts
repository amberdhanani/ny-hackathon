import { onRequest } from "firebase-functions/v2/https";
import express, { Request, Response } from "express";
import cors from "cors";
import OpenAI from "openai";
import * as dotenv from "dotenv";
import Busboy from "busboy";
import fs from "fs";
import path from "path";
import os from "os";
import { context } from "./context";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
app.use(cors({ origin: true }));
app.use(express.raw({ type: "multipart/form-data", limit: "50mb" }));

app.post("/transcribe", async (req: Request, res: Response) => {
  console.log("🔹 Incoming request to /transcribe");
  console.log("📌 Request Headers:", req.headers);

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

    // Transcribe the audio using the Whisper model.
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
      return res.json({ transcript: "No speech detected.", analysis: "No speech detected." });
    }

    const formattedTranscript = words
      .map((word: any) => word.word)
      .join(" ")
      .replace(/\s([.,!?])/g, "$1");

    // Create a prompt to analyze the transcript for fixed mindset language.
    const analysisPrompt = `
      Analyze the following transcript and identify any segments that contain fixed mindset language.
      If you find any, please provide details on which parts exhibit a fixed mindset and explain why.
      Transcript: "${formattedTranscript}"
    `;
    console.log ("Formatted Transcript", formattedTranscript);

    // Use ChatGPT to analyze the transcript.
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: context },
        { role: "user", content: analysisPrompt },
      ],
    });

    const analysis =
      analysisResponse.choices && analysisResponse.choices[0].message
        ? analysisResponse.choices[0].message.content?.trim() ?? "Analysis not available."
        : "Analysis not available.";

        console.log("✅ Analysis received:", analysis);
    // Return both the transcript and the analysis.
    return res.json({ transcript: formattedTranscript, analysis });
  } catch (error: unknown) {
    console.error("❌ Error processing request:", (error as Error).message);
    return res.status(500).json({ error: (error as Error).message || "Internal Server Error" });
  }
});

// ✅ Function to Process Uploaded File Using Busboy
async function processFile(
  bodyBuffer: Buffer,
  headers: any
): Promise<{ filePath: string | null; fileName: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers });

    let filePath: string | null = null;
    let fileName: string = "unknown_file.webm";
    let mimeType: string = "audio/webm";

    console.log("🟡 Parsing file using Busboy...");

    busboy.on("file", (_fieldname: string, file: NodeJS.ReadableStream, filename: unknown, _encoding: string, mimetype: string) => {
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
    });

    busboy.on("error", (error: any) => reject(new Error(`File upload failed: ${error.message}`)));

    console.log("⏳ Manually feeding bodyBuffer to Busboy...");
    busboy.end(bodyBuffer);
  });
}

// ✅ Firebase Functions v2
export const api = onRequest(app);
