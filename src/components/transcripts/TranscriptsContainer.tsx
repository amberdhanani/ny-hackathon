import { useRecoilValue } from "recoil";
import TranscriptsTable from "./TranscriptsTable";
import { siteLoadingAtom, transcriptsAtom } from "../../recoil/atoms";
import { Box, CircularProgress } from "@mui/material";

const TranscriptsContainer = () => {
  const transcripts = useRecoilValue(transcriptsAtom);
  const siteLoading = useRecoilValue(siteLoadingAtom);
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      {siteLoading ? (
        <Box>
          <CircularProgress size={80} sx={{ color: "#4F46E5" }} />
        </Box>
      ) : (
        <TranscriptsTable transcripts={transcripts} />
      )}
    </div>
  );
};

export default TranscriptsContainer;
