import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTranscriptId, setSelectedTranscriptId] = useState<string | null>(null);
  const setTranscripts = useSetRecoilState(transcriptsAtom);

  /**
   * Handles transcript deletion confirmation.
   */
  const confirmDelete = async () => {
    if (!selectedTranscriptId) return;

    try {
      await deleteDoc(doc(db, "transcripts", selectedTranscriptId));
      setTranscripts((prev) => prev.filter((t) => t.id !== selectedTranscriptId));
      console.log("Transcript deleted successfully");
    } catch (error) {
      console.error("Error deleting transcript:", error);
    } finally {
      setOpenDeleteDialog(false);
      setSelectedTranscriptId(null);
    }
  };

  /**
   * Opens delete confirmation dialog for a selected transcript.
   */
  const handleDeleteClick = (id?: string) => {
    if (id) {
      setSelectedTranscriptId(id);
      setOpenDeleteDialog(true);
    }
  };

  return (
    <>
      {/* Transcripts Table */}
      <TableContainer sx={tableContainerStyles}>
        <Table stickyHeader sx={{ width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              {["Date", "Title", "Recommendations"].map((header) => (
                <TableCell key={header} align="left" sx={tableHeaderStyles}>
                  {header}
                </TableCell>
              ))}
               <TableCell align="right" sx={tableHeaderStyles}>
                Actions
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transcripts.map((transcript) => (
              <TranscriptRow key={transcript.id} transcript={transcript} handleDeleteClick={handleDeleteClick} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <DeleteTranscriptDialog setOpen={setOpenDeleteDialog} open={openDeleteDialog} confirmDelete={confirmDelete} />
    </>
  );
};

export default TranscriptsTable;

// Extracted styles
const tableContainerStyles = {
  width: "100%",
  maxHeight: "60vh",
  overflowY: "auto",
};

const tableHeaderStyles = {
  backgroundColor: "rgba(79, 70, 229, 0.06)",
  fontWeight: "bold",
};
