import OpenAI from "openai";
import { context } from "./context";
import { logInfo, logError } from "./logger";

export const generateTitle = async (transcript: string): Promise<string> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const prompt = `Generate a concise and engaging 5-10 word title for the following transcript: ${transcript}`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: context },
        { role: "user", content: prompt },
      ],
    });

    const title = response.choices?.[0]?.message?.content?.trim() ?? "Untitled Transcript";
    logInfo(`✅ Title generated: ${title}`);
    return title;
  } catch (error) {
    logError(`❌ Title generation error: ${(error as Error).message}`);
    return "Untitled Transcript";
  }
};

export const analyzeTranscript = async (transcript: string): Promise<string> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const prompt = `Analyze the following transcript and identify any segments that contain fixed mindset language. If you find any, please provide details on which parts exhibit a fixed mindset and explain why. Transcript: "${transcript}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: context },
        { role: "user", content: prompt },
      ],
    });

    const analysis = response.choices?.[0]?.message?.content?.trim() ?? "Analysis not available.";
    logInfo("✅ Analysis generated");
    return analysis;
  } catch (error) {
    logError(`❌ Analysis error: ${(error as Error).message}`);
    return "Analysis not available.";
  }
};
