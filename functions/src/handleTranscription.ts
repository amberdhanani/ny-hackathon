import { Request, Response } from "express";
import { processFileUpload } from "./fileProcessor";
import { transcribeAudio } from "./transcriptionService";
import { generateTitle, analyzeTranscript } from "./aiService";
import { logInfo, logError, logWarning } from "./logger";
import { handleError } from "./errorHandler";

export const handleTranscription = async (req: Request, res: Response) => {
  try {
    logInfo("🔹 Incoming request to /transcribe");

    if (!req.headers["content-type"]?.includes("multipart/form-data")) {
      logError("❌ Invalid content type");
      return res.status(400).json({ error: "Invalid content type" });
    }

    // Process file upload
    const { filePath } = await processFileUpload(req);
    if (!filePath) return res.status(400).json({ error: "No file uploaded." });

    // Perform transcription
    const transcription = await transcribeAudio(filePath);
    const formattedTranscript = transcription.words?.map((word: { word: string }) => word.word).join(" ") || "";

    if (!formattedTranscript) {
      logWarning("⚠️ No words detected in the transcript.");
      return res.json({
        transcript: "No speech detected.",
        analysis: "No speech detected.",
        title: "No speech detected.",
      });
    }

    // Generate AI-driven metadata in parallel
    const [title, analysis] = await Promise.all([
      generateTitle(formattedTranscript),
      analyzeTranscript(formattedTranscript),
    ]);

    return res.json({ transcript: formattedTranscript, title, analysis });
  } catch (error) {
    handleError(error, res);
    return;
  }
};
