import React, { useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { TranscriptRecord } from "../../types/types";
import TranscriptRow from "./TranscriptRow";
import DeleteTranscriptDialog from "./DeleteTranscriptDialog";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useSetRecoilState } from "recoil";
import { transcriptsAtom } from "../../recoil/atoms";

type Props = {
  transcripts: TranscriptRecord[];
};

const TranscriptsTable = ({ transcripts }: Props) => {
  // State to manage delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTranscriptId, setSelectedTranscriptId] = useState<string | null>(null);
  const setTranscripts = useSetRecoilState(transcriptsAtom);

  // Confirm delete function
  const confirmDelete = async () => {
    if (!selectedTranscriptId) return;

    try {
      await deleteDoc(doc(db, "transcripts", selectedTranscriptId));

      // Remove from state
      setTranscripts((prev) => prev.filter((t) => t.id !== selectedTranscriptId));

      console.log("Transcript deleted successfully");
    } catch (error) {
      console.error("Error deleting transcript:", error);
    } finally {
      setOpenDeleteDialog(false);
      setSelectedTranscriptId(null);
    }
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (id: string | undefined) => {
    if (!id) return;
    setSelectedTranscriptId(id);
    setOpenDeleteDialog(true);
  };

  return (
    <>
      {/* Transcripts Table */}
      <TableContainer
        component={Paper}
        style={{
          maxWidth: 800,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>Date</strong></TableCell>
              <TableCell align="center"><strong>Title</strong></TableCell>
              <TableCell align="center"><strong>Recommendations</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {transcripts.map((transcript) => (
              <TranscriptRow 
                key={transcript.id} 
                transcript={transcript} 
                handleDeleteClick={handleDeleteClick} 
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <DeleteTranscriptDialog 
        setOpen={setOpenDeleteDialog} 
        open={openDeleteDialog} 
        confirmDelete={confirmDelete} 
      />
    </>
  );
};

export default TranscriptsTable;