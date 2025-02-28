import { useRecoilValue } from "recoil";
import TranscriptsTable from "./TranscriptsTable";
import { transcriptsAtom } from "../../recoil/atoms";

const TranscriptsContainer = () => {
  const transcripts = useRecoilValue(transcriptsAtom);
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <TranscriptsTable transcripts={transcripts} />
    </div>
  );
};

export default TranscriptsContainer;
