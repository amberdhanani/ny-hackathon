import React, { useMemo } from "react";
import { Chip, IconButton, TableCell, TableRow } from "@mui/material";
import { TranscriptRecord } from "../../types/types";
import { isoToMMDDYYYY } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { selectedTranscriptAtom } from "../../recoil/atoms";

type Props = {
  transcript: TranscriptRecord;
  handleDeleteClick: (id?: string) => void;
};

const TranscriptRow = ({ transcript, handleDeleteClick }: Props) => {
  const setSelectedTranscript = useSetRecoilState(selectedTranscriptAtom);
  const navigate = useNavigate();

  /**
   * Computes the number of recommendations based on flagged negative sentences.
   */
  const numberOfRecommendations = useMemo(
    () => transcript.sentences.reduce((acc, sentence) => (sentence.flag?.includes("negative") ? acc + 1 : acc), 0),
    [transcript],
  );

  /**
   * Navigates to the transcript view and updates Recoil state.
   */
  const handleViewClick = () => {
    setSelectedTranscript(transcript);
    navigate("/transcript");
  };

  return (
    <TableRow>
      <TableCell align="left">{isoToMMDDYYYY(transcript.createdAt)}</TableCell>
      <TableCell align="left">{transcript.title}</TableCell>
      <TableCell align="left">
        <Chip label={`${numberOfRecommendations} recommendations`} sx={getChipStyles(numberOfRecommendations)} />
      </TableCell>
      <TableCell align="right">
        <IconButton onClick={handleViewClick} title="View">
          <img src="/view-eyeball.svg" alt="View" width="48" height="48" />
        </IconButton>
        <IconButton onClick={() => handleDeleteClick(transcript.id)} title="Delete">
          <img src="/trash.svg" alt="Delete" width="48" height="48" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default TranscriptRow;

/**
 * Returns styles for the recommendations Chip based on count.
 */
const getChipStyles = (recommendationCount: number) => ({
  backgroundColor: recommendationCount === 0 ? "#0284C733" : "rgba(79, 70, 229, 0.3)",
  color: recommendationCount === 0 ? "#0284C7" : "rgba(39, 31, 169, 1)",
  fontWeight: "bold",
  borderRadius: 2,
});
