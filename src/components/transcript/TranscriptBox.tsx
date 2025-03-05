import React, { useCallback } from "react";
import { TranscriptEntry, TranscriptRecord } from "../../types/types";
import { Box, Paper } from "@mui/material";
import TranscriptEntryRow from "./TranscriptEntryRow";

type Props = {
  transcript: TranscriptRecord;
  handleClick: (entry: TranscriptEntry) => void;
  selectedTranscriptEntry: TranscriptEntry | null;
};

const TranscriptBox = ({ transcript, handleClick, selectedTranscriptEntry }: Props) => {
  const handleEntryClick = useCallback((entry: TranscriptEntry) => handleClick(entry), [handleClick]);

  return (
    <Paper elevation={3} sx={paperStyles}>
      <Box sx={contentBoxStyles}>
        {transcript?.sentences.map((entry, index, arr) => (
          <TranscriptEntryRow
            key={index}
            entry={entry}
            showLabel={index === 0 || arr[index - 1].userLabel !== entry.userLabel}
            isSelected={selectedTranscriptEntry?.transcribed === entry.transcribed}
            onClick={handleEntryClick}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default TranscriptBox;

/**
 * Individual transcript entry row component.
 */

/**
 * Styles
 */
const paperStyles = {
  backgroundColor: "#fff",
  display: "flex",
  padding: "8px",
  borderRadius: 2,
  height: "calc(80vh - 200px)",
};

const contentBoxStyles = {
  display: "flex",
  flexDirection: "column",
  paddingX: "24px",
  paddingY: "4px",
  borderRadius: 2,
  border: "2px dashed #B6B2FF",
  boxSizing: "border-box",
  width: "100%",
  flexGrow: 1, // Ensures the box expands inside its parent
  overflowY: "auto",
};
