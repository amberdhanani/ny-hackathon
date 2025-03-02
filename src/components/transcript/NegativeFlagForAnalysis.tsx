import React from "react";
import { TranscriptEntry } from "../../types/types";

type Props = {
  entry: TranscriptEntry;
};

const NegativeFlagForAnalysis = ({ entry }: Props) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#FFF4E5",
          border: "1px solid #9A3412",
          color: "#e65100",
          padding: "8px 12px",
          borderRadius: "6px",
          marginTop: "20px",
          marginBottom: "12px",
        }}
      >
        <img src="/assets/warning.svg" alt="Warning" style={{ width: "16px" }} />
        <span style={{ fontSize: "14px", fontWeight: "600" }}>Fixed mindset language</span>
      </div>
      <p style={{ color: "#555", fontStyle: "italic", marginBottom: "12px" }}>{entry.transcribed}</p>

      {entry.flagDetails && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(240, 249, 255, 1)",
              border: "1px solid rgba(7, 89, 133, 1)",
              color: "#0d47a1",
              padding: "8px 12px",
              borderRadius: "6px",
              marginBottom: "12px",
            }}
          >
            <img src="/assets/check-circle.svg" alt="Good" style={{ width: "16px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Try This Instead</span>
          </div>
          <p style={{ color: "#222", fontWeight: "500", lineHeight: "1.5" }}>{entry.flagDetails.tryInstead}</p>

          {/* Why this can be improved */}
          <h4 style={{ color: "#222", fontWeight: "600", marginTop: "16px" }}>WHY THIS CAN BE IMPROVED?</h4>
          <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.5" }}>{entry.flagDetails.why}</p>
        </>
      )}
    </>
  );
};

export default NegativeFlagForAnalysis;
