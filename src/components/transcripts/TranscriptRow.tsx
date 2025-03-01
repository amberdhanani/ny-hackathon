import React, { useState } from "react";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { TranscriptRecord } from "../../types/types";
import { isoToMMDDYYYY } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { selectedTranscriptAtom, transcriptsAtom } from "../../recoil/atoms";

type Props = {
  transcript: TranscriptRecord;
  handleDeleteClick: (id: string | undefined) => void;
};

const TranscriptRow = ({ transcript, handleDeleteClick }: Props) => {
  const setSelectedTranscript = useSetRecoilState(selectedTranscriptAtom);
  const navigate = useNavigate();

  const handleViewClick = (transcript: TranscriptRecord) => {
    setSelectedTranscript(transcript);
    navigate("/transcript");
  };

  const countRecommendations = (transcript: TranscriptRecord) => {
    return transcript.sentences.reduce((acc, sentence) => {
      if (sentence.flag?.includes("negative")) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };

  return (
    <TableRow key={transcript.id}>
      <TableCell align="left">{isoToMMDDYYYY(transcript.createdAt)}</TableCell>
      <TableCell align="left">{transcript.title}</TableCell>
      <TableCell align="left">{countRecommendations(transcript)}</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => handleViewClick(transcript)} title="View">
          <img src="/view-eyeball.svg" alt="View" width="24" height="24" />
        </IconButton>
        <IconButton title="Delete" onClick={() => handleDeleteClick(transcript.id)}>
          <img src="/trash.svg" alt="Delete" width="24" height="24" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default TranscriptRow;
