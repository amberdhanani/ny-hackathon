import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { handleTranscription } from "./transcribeAudio";

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.raw({ type: "multipart/form-data", limit: "50mb" }));

app.post("/transcribe", handleTranscription);

export const api = onRequest(app);
