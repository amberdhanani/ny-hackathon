import React from "react";
import { Box, Grid2 as Grid } from "@mui/material";
import TranscriptTopBar from "./TranscriptTopBar";
import TranscriptBox from "./TranscriptBox";
import AnalysisBox from "./AnalysisBox";
import { useTranscriptNavigation } from "../../hooks/useTranscriptNavigation";

const TranscriptContainer = () => {
  const {
    selectedTranscript,
    selectedTranscriptEntry,
    handleClick,
    handleNextFlaggedEntry,
    handlePreviousFlaggedEntry,
    hasNextFlaggedEntry,
    hasPreviousFlaggedEntry,
  } = useTranscriptNavigation();

  return (
    <div style={styles.pageContainer}>
      {selectedTranscript && (
        <>
          <TranscriptTopBar transcript={selectedTranscript} />
          <Box sx={{ marginX: 4 }}>
            <Grid container spacing={4}>
              <Grid size={{ sm: 7 }}>
                <TranscriptBox
                  transcript={selectedTranscript}
                  handleClick={handleClick}
                  selectedTranscriptEntry={selectedTranscriptEntry}
                />
              </Grid>

              {/* Analysis Section */}
              {selectedTranscriptEntry && (
                <Grid size={{ sm: 5 }}>
                  <AnalysisBox
                    entry={selectedTranscriptEntry}
                    onNext={handleNextFlaggedEntry}
                    onPrevious={handlePreviousFlaggedEntry}
                    hasNext={hasNextFlaggedEntry}
                    hasPrevious={hasPreviousFlaggedEntry}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      )}
    </div>
  );
};

export default TranscriptContainer;

const styles = {
  pageContainer: {
    fontFamily: "'Nunito', sans-serif",
    padding: "20px",
  },
};
