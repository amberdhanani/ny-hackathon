import fs from "fs";
import OpenAI from "openai";
import { logInfo, logError } from "./logger";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const transcribeAudio = async (filePath: string) => {
  try {
    logInfo(`🚀 Sending file "${filePath}" to OpenAI for transcription...`);

    return await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });
  } catch (error) {
    logError(`❌ Transcription error: ${(error as Error).message}`);
    throw error;
  }
};
