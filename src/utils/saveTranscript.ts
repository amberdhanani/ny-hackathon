import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { TranscriptRecord } from "../types/types";

export const saveTranscript = async (transcriptData: Omit<TranscriptRecord, "id">) => {
  const colRef = collection(db, "transcripts");
  const createdDoc = await addDoc(colRef, transcriptData);
  return { ...transcriptData, id: createdDoc.id };
};
