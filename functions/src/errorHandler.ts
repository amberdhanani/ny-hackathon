import { Response } from "express";
import { logError } from "./logger";

export const handleError = (error: unknown, res: Response) => {
  logError(`❌ Error processing request: ${(error as Error).message}`);
  res.status(500).json({ error: (error as Error).message || "Internal Server Error" });
};
