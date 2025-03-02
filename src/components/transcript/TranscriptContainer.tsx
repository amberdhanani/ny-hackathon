import React from "react";
import { Box, Grid2 as Grid } from "@mui/material";
import TranscriptTopBar from "./TranscriptTopBar";
import TranscriptBox from "./TranscriptBox";
import AnalysisBox from "./AnalysisBox";
import { useTranscriptNavigation } from "../../hooks/useTranscriptNavigation";
import HighlightsBox from "./HighlightsBox";

const TranscriptContainer = () => {
  const {
    selectedTranscript,
    selectedTranscriptEntry,
    handleClick,
    handleNextFlaggedEntry,
    handlePreviousFlaggedEntry,
    hasNextFlaggedEntry,
    hasPreviousFlaggedEntry,
    subPage,
    setSubPage,
  } = useTranscriptNavigation();

  return (
    <div style={styles.pageContainer}>
      {selectedTranscript && (
        <>
          <TranscriptTopBar transcript={selectedTranscript} setSubPage={setSubPage} subPage={subPage} />
          <Box sx={{ marginX: 4, mt: 4 }}>
            <Grid container spacing={4}>
              <Grid size={{ sm: 7 }}>
                {subPage === "Highlights" ? (
                  <HighlightsBox
                    transcript={selectedTranscript}
                    handleClick={handleClick}
                    selectedTranscriptEntry={selectedTranscriptEntry}
                  />
                ) : (
                  <TranscriptBox
                    transcript={selectedTranscript}
                    handleClick={handleClick}
                    selectedTranscriptEntry={selectedTranscriptEntry}
                  />
                )}
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
