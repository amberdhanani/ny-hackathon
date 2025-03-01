import * as dotenv from "dotenv";
dotenv.config(); // Ensure this runs first before any other imports
import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import { handleTranscription } from "./transcribeAudio";

const app = express();
app.use(cors({ origin: true }));
app.use(express.raw({ type: "multipart/form-data", limit: "50mb" }));

app.post("/transcribe", handleTranscription);

export const api = onRequest(app);
