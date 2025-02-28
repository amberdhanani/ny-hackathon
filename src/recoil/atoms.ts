import { atom } from "recoil";
import { TranscriptRecord } from "../types/types";

export const selectedTranscriptAtom = atom<TranscriptRecord | null>({
  key: "selectedTranscriptAtom",
  default: null,
});

export const transcriptsAtom = atom<TranscriptRecord[]>({
  key: "transcriptsAtom",
  default: [],
});