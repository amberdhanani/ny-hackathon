import { useRecoilValue } from "recoil";
import TranscriptsTable from "./TranscriptsTable";
import { siteLoadingAtom, transcriptsAtom } from "../../recoil/atoms";
import { Box, CircularProgress } from "@mui/material";
import GoToNewRecording from "../goToNewRecording/GoToNewRecording";

const TranscriptsContainer = () => {
  const transcripts = useRecoilValue(transcriptsAtom);
  const siteLoading = useRecoilValue(siteLoadingAtom);
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: 8,
          width: "60%",
        }}
      >
        {siteLoading ? (
          <Box>
            <CircularProgress size={80} sx={{ color: "#4F46E5" }} />
          </Box>
        ) : (
          <div>
            <GoToNewRecording />
            <TranscriptsTable transcripts={transcripts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptsContainer;
