import React from "react";
import { TranscriptEntry } from "../../types/types";
import NegativeFlagForAnalysis from "./NegativeFlagForAnalysis";
import PositiveFlagForAnalysis from "./PositiveFlagForAnalysis";
import AnalysisNavigation from "./AnalysisNavigation";

type Props = {
  entry: TranscriptEntry;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

export default function AnalysisBox({ entry, onNext, onPrevious, hasNext, hasPrevious }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "calc(80vh - 200px)",
        overflowY: "auto",
        padding: "8px",
        backgroundColor: "white",
        boxShadow: "4px 4px 0px rgba(0,0,0,0.7)",
        borderRadius: "6px",
        width: "90%",
      }}
    >
      <div style={{ padding: "8px" }}>
        {/* Main Content */}
        <div style={{ flexGrow: 1 }}>
          {entry.flag === "negative" && <NegativeFlagForAnalysis entry={entry} />}
          {entry.flag === "positive" && <PositiveFlagForAnalysis entry={entry} />}
        </div>
      </div>

      {/* Navigation Buttons */}
      <AnalysisNavigation onNext={onNext} onPrevious={onPrevious} hasNext={hasNext} hasPrevious={hasPrevious} />
    </div>
  );
}
