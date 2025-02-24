import { atom } from "recoil";
import { TranscriptRecord } from "../types/types";
export const transcriptIdAtom = atom<TranscriptRecord | null>({
  key: "transcriptIdAtom",
  default: null,
});