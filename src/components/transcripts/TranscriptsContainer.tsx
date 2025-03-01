import { useRecoilValue } from "recoil";
import TranscriptsTable from "./TranscriptsTable";
import { siteLoadingAtom, transcriptsAtom } from "../../recoil/atoms";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import GoToNewRecording from "../goToNewRecording/GoToNewRecording";

const TranscriptsContainer = () => {
  const transcripts = useRecoilValue(transcriptsAtom);
  const siteLoading = useRecoilValue(siteLoadingAtom);

  return (
    <Box sx={containerStyles}>
      <Paper elevation={3} sx={paperStyles}>
        <Box sx={contentBoxStyles}>
          {siteLoading ? (
            <CircularProgress size={80} sx={{ color: "#4F46E5" }} />
          ) : (
            <>
              <GoToNewRecording />
              <Typography variant="h6" sx={titleStyles}>
                Recent Transcripts
              </Typography>
              <TranscriptsTable transcripts={transcripts} />
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TranscriptsContainer;

// Extracted styles for maintainability
const containerStyles = {
  display: "flex",
  justifyContent: "center",
  marginTop: "50px",
};

const paperStyles = {
  backgroundColor: "#fff",
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
  padding: "8px",
  borderRadius: 2,
  width: "60%",
};

const contentBoxStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "24px",
  borderRadius: 2,
  border: "2px dashed #B6B2FF",
  boxSizing: "border-box",
  width: "100%",
};

const titleStyles = {
  marginTop: "20px",
  fontWeight: "bold",
  fontSize: 18,
  marginBottom: "10px",
};
