import { Request, Response } from "express";
import multer from "multer";
import { PassThrough } from "stream";
import { OpenAI } from "openai";

// Set up Multer to store incoming files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Export aiCall as an array of middlewares: first the upload middleware, then our handler
export const aiCall = [
  upload.single("audio"),
  async (req: Request, res: Response): Promise<void> => {
    const openAIKey =
      "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";
    const openai = new OpenAI({
      apiKey: openAIKey,
      organization: "org-u08SqjgwWAOjtjC6lywlTVYv",
    });

    try {
      if (!req.file) {
        res.status(400).json({ error: "No audio file provided." });
        return;
      }

      // Convert the in-memory buffer to a stream for the OpenAI API
      const bufferStream = new PassThrough();
      bufferStream.end(req.file.buffer);

      // Transcribe the audio using OpenAI's Whisper API
      const transcriptionResponse = await openai.audio.transcriptions.create({
        file: bufferStream as any,
        model: "whisper-1",
        response_format: "json",
      });

      // Log the full transcription response for debugging
      console.log("Transcription response:", transcriptionResponse);

      // Extract the transcribed text
      const transcriptText = transcriptionResponse.text;
      if (!transcriptText) {
        throw new Error(
          "Transcription failed: received null or empty transcription text."
        );
      }
      console.log("Transcribed text:", transcriptText);

      // Optionally, retrieve chatHistory from the request body (if provided)
      let chatHistory = [];
      if (req.body.chatHistory) {
        try {
          chatHistory = JSON.parse(req.body.chatHistory);
        } catch (err) {
          console.error("Error parsing chatHistory:", err);
        }
      }

      // Build the messages array for the chat completion call
      let messages = [];
      if (!chatHistory || chatHistory.length === 0) {
        console.log("No Chat History - using default system prompt");
        messages.push({
          role: "system",
          content: `
You are a growth mindset language expert analyzing a classroom conversation between a teacher and students. Your role is to listen for any phrases that indicate a fixed mindset or growth mindset in the dialogue.
Task Overview:
Analyze the transcript provided.
Identify statements that contain fixed mindset language (negative flag) or growth mindset language (positive flag).
Return the full transcript as a structured JSON array where each chunk is an object containing:
  - transcribed (string) → The exact text spoken.
  - userLabel ('teacher' | 'student') → Who said it. If unsure, default to 'teacher'.
  - flag ('positive' | 'negative' | null) → Whether the statement reflects a growth mindset, fixed mindset, or is neutral.
  - flagDetails (object | null) → Additional details if flagged:
      - tryInstead (string | null) → If the statement reflects a fixed mindset, provide an alternative phrasing aligned with a growth mindset.
      - why (string) → If flagged, explain why it demonstrates a fixed or growth mindset.
Output Format (Type Definition):
json

Example:
[
  {
    "transcribed": "You’re either good at math or you’re not.",
    "userLabel": "teacher",
    "flag": "negative",
    "flagDetails": {
      "tryInstead": "Math is a skill that improves with practice and effort.",
      "why": "This statement promotes a fixed mindset by implying that math ability is innate rather than developed through effort."
    }
  },
  {
    "transcribed": "I can tell you’ve been working hard on this problem!",
    "userLabel": "teacher",
    "flag": "positive",
    "flagDetails": {
      "tryInstead": null,
      "why": "This statement encourages a growth mindset by reinforcing the idea that effort leads to improvement."
    }
  },
  {
    "transcribed": "Let’s review the next question together.",
    "userLabel": "teacher",
    "flag": null,
    "flagDetails": null
  }
]
          `,
        });
      } else {
        messages = chatHistory;
      }

      // Append the transcribed text as the user's message
      messages.push({
        role: "user",
        content: transcriptText,
      });

      // Call the Chat API with the built messages array
      const chatResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
      });

      const assistantResponse =
        chatResponse.choices?.[0]?.message?.content?.trim();
      if (!assistantResponse) {
        throw new Error("Failed to generate AI response.");
      }

      messages.push({
        role: "assistant",
        content: assistantResponse,
      });

      // Return the complete conversation (including the AI's reply)
      res.status(200).json({
        response: messages,
      });
    } catch (error) {
      console.error("Error in aiCall:", error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },
];
