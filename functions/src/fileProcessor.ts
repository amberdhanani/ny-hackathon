import { Request } from "express";
import fs from "fs";
import Busboy from "busboy";
import path from "path";
import os from "os";
import { logInfo, logError } from "./logger";

export const processFileUpload = (req: Request): Promise<{ filePath: string | null; fileName: string }> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line new-cap
    const busboy = Busboy({ headers: req.headers });
    let filePath: string | null = null;
    let fileName = "unknown_file.webm";

    busboy.on("file", (_fieldname: string, file: NodeJS.ReadableStream, filename: string | undefined) => {
      if (filename && typeof filename === "string") {
        fileName = filename.trim();
      } else {
        logError("⚠️ Warning: filename is undefined, using default.");
      }

      filePath = path.join(os.tmpdir(), fileName);
      const writeStream = fs.createWriteStream(filePath);

      file.pipe(writeStream);

      writeStream.on("finish", () => {
        logInfo(`✅ File saved to: ${filePath}`);
        resolve({ filePath, fileName });
      });

      writeStream.on("error", (error) => {
        logError("❌ File write error: " + error.message);
        reject(new Error(`File writing failed: ${error.message}`));
      });
    });

    busboy.on("error", (error: Error) => reject(new Error(`File upload failed: ${error.message}`)));
    req.pipe(busboy);
  });
};
