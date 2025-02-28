import React from "react";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { TranscriptRecord } from "../../types/types";
import { useSetRecoilState } from "recoil";
import { selectedTranscriptAtom } from "../../recoil/atoms";
import { useNavigate } from "react-router-dom";
import { isoToMMDDYYYY } from "../../utils/utils";

type Props = {
  transcripts: TranscriptRecord[];
};

const TranscriptsTable = ({ transcripts }: Props) => {
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
    <TableContainer
      component={Paper}
      style={{
        maxWidth: 800,
        maxHeight: "60vh",
        overflowY: "auto",
      }}
    >
      <Table stickyHeader>
        {/* Table Header */}
        <TableHead>
          <TableRow>
            <TableCell
              align="left"
              style={{
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 2,
              }}
            >
              <strong>Date</strong>
            </TableCell>
            <TableCell
              align="left"
              style={{
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 2,
              }}
            >
              <strong>Title</strong>
            </TableCell>
            <TableCell
              align="left"
              style={{
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 2,
              }}
            >
              <strong>Recommendations</strong>
            </TableCell>
            <TableCell
              align="right"
              style={{
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 2,
              }}
            >
              <strong>Actions</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {transcripts.map((transcript) => (
            <TableRow key={transcript.id}>
              <TableCell align="left">{isoToMMDDYYYY(transcript.createdAt)}</TableCell>
              <TableCell align="left">{transcript.title}</TableCell>
              <TableCell align="left">{countRecommendations(transcript)}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleViewClick(transcript)} title="View">
                  <img src="/view-eyeball.svg" alt="View" width="24" height="24" />
                </IconButton>
                <IconButton title="Download">
                  <img src="/download-icon.svg" alt="Download" width="24" height="24" />
                </IconButton>
                <IconButton title="Delete">
                  <img src="/trash.svg" alt="Delete" width="24" height="24" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TranscriptsTable;
