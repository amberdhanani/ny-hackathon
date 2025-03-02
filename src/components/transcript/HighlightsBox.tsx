import React, { useCallback } from "react";
import { TranscriptEntry, TranscriptRecord } from "../../types/types";
import { Box, Paper, Typography } from "@mui/material";

type Props = {
  transcript: TranscriptRecord;
  handleClick: (entry: TranscriptEntry) => void;
  selectedTranscriptEntry: TranscriptEntry | null;
};

const HighlightsBox = ({ transcript, handleClick, selectedTranscriptEntry }: Props) => {
  const handleEntryClick = useCallback((entry: TranscriptEntry) => handleClick(entry), [handleClick]);

  // Filter transcript entries into categories
  const positiveEntries = transcript.sentences.filter((entry) => entry.flag === "positive");
  const negativeEntries = transcript.sentences.filter((entry) => entry.flag === "negative");

  return (
    <Paper elevation={3} sx={paperStyles}>
      <Box sx={contentBoxStyles}>
        {/* Reconsider Section */}
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
          <span style={{ fontSize: "18px", fontWeight: "600" }}>Reconsider</span>
        </div>
        <Box sx={entryListStyles}>
          {negativeEntries.map((entry, index) => (
            <Typography
              key={index}
              sx={{
                ...entryStyles,
                backgroundColor: selectedTranscriptEntry === entry ? "#fafafa" : "transparent",
              }}
              onClick={() => handleEntryClick(entry)}
            >
              {entry.transcribed}
            </Typography>
          ))}
        </Box>
        {/* Great Job Section */}
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
          <span style={{ fontSize: "18px", fontWeight: "600" }}>Great Job</span>
        </div>
        <Box sx={entryListStyles}>
          {positiveEntries.map((entry, index) => (
            <Typography
              key={index}
              sx={{
                ...entryStyles,
                backgroundColor: selectedTranscriptEntry === entry ? "#fafafa" : "transparent",
              }}
              onClick={() => handleEntryClick(entry)}
            >
              {entry.transcribed}
            </Typography>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default HighlightsBox;

/**
 * Styles
 */
const paperStyles = {
  backgroundColor: "#fff",
  display: "flex",
  marginBottom: "20px",
  padding: "8px",
  borderRadius: 2,
  height: "calc(80vh - 200px)",
  overflowY: "auto",
};

const contentBoxStyles = {
  display: "flex",
  flexDirection: "column",
  padding: "24px",
  borderRadius: 2,
  border: "2px dashed #B6B2FF",
  boxSizing: "border-box",
  width: "100%",
  flexGrow: 1, // Ensures the box expands inside its parent
};

const entryListStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  marginBottom: "16px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const entryStyles = {
  padding: "8px",
  borderRadius: "4px",

  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
};
