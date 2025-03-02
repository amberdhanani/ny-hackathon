import React, { useState } from "react";
import { TranscriptRecord } from "../../types/types";
import { Box } from "@mui/material";
import EditTitleDialog from "./EditTitleDialog";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useSetRecoilState } from "recoil";
import { transcriptsAtom } from "../../recoil/atoms";

type Props = {
  transcript: TranscriptRecord;
};

const TranscriptTopBar = ({ transcript }: Props) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState(transcript.title);
  const setTranscripts = useSetRecoilState(transcriptsAtom);

  const handleSaveTitle = async (newTitle: string) => {
    try {
      if (!transcript.id) return;
      await updateDoc(doc(db, "transcripts", transcript.id), { title: newTitle });
      setTitle(newTitle); // Update local state
      setTranscripts((oldTranscripts) =>
        oldTranscripts.map((t) => (t.id === transcript.id ? { ...t, title: newTitle } : t)),
      );
    } catch (error) {
      console.error("Error updating transcript title:", error);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
        <h1>{title}</h1>
        <img
          src="/assets/pen.svg"
          alt="Edit Title"
          style={{ marginLeft: "10px", width: 24, cursor: "pointer" }}
          onClick={() => setDialogOpen(true)}
        />
      </Box>

      <EditTitleDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        currentTitle={title}
        onSave={handleSaveTitle}
      />
    </>
  );
};

export default TranscriptTopBar;
