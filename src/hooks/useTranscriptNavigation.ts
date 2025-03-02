import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { TranscriptEntry } from "../types/types";
import { selectedTranscriptAtom } from "../recoil/atoms";

export const useTranscriptNavigation = () => {
  const [selectedTranscriptEntry, setSelectedTranscriptEntry] = useState<TranscriptEntry | null>(null);
  const selectedTranscript = useRecoilValue(selectedTranscriptAtom);
  const [subPage, setSubPage] = useState<"Transcript" | "Highlights">("Transcript");
  const navigate = useNavigate();

  // Redirect if no transcript is selected
  useEffect(() => {
    if (!selectedTranscript) {
      navigate("/transcripts");
    }
  }, [selectedTranscript, navigate]);

  const handleClick = (entry: TranscriptEntry) => {
    setSelectedTranscriptEntry(entry);
  };

  const findNextFlaggedEntry = () => {
    if (!selectedTranscript || !selectedTranscriptEntry) return null;

    const { sentences } = selectedTranscript;
    const currentIndex = sentences.findIndex((entry) => entry.transcribed === selectedTranscriptEntry.transcribed);

    for (let i = currentIndex + 1; i < sentences.length; i++) {
      if (sentences[i].flag === "positive" || sentences[i].flag === "negative") {
        return sentences[i];
      }
    }
    return null;
  };

  const findPreviousFlaggedEntry = () => {
    if (!selectedTranscript || !selectedTranscriptEntry) return null;

    const { sentences } = selectedTranscript;
    const currentIndex = sentences.findIndex((entry) => entry.transcribed === selectedTranscriptEntry.transcribed);

    for (let i = currentIndex - 1; i >= 0; i--) {
      if (sentences[i].flag === "positive" || sentences[i].flag === "negative") {
        return sentences[i];
      }
    }
    return null;
  };

  const handleNextFlaggedEntry = () => {
    const nextEntry = findNextFlaggedEntry();
    if (nextEntry) {
      setSelectedTranscriptEntry(nextEntry);
    }
  };

  const handlePreviousFlaggedEntry = () => {
    const prevEntry = findPreviousFlaggedEntry();
    if (prevEntry) {
      setSelectedTranscriptEntry(prevEntry);
    }
  };

  return {
    selectedTranscript,
    selectedTranscriptEntry,
    setSelectedTranscriptEntry,
    handleClick,
    handleNextFlaggedEntry,
    handlePreviousFlaggedEntry,
    hasNextFlaggedEntry: !!findNextFlaggedEntry(),
    hasPreviousFlaggedEntry: !!findPreviousFlaggedEntry(),
    subPage,
    setSubPage,
  };
};
