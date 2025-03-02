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
  subPage: "Transcript" | "Highlights";
  setSubPage: (subPage: "Transcript" | "Highlights") => void;
};

const TranscriptTopBar = ({ transcript, setSubPage, subPage }: Props) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState(transcript.title);
  const setTranscripts = useSetRecoilState(transcriptsAtom);
  const tabs = ["Highlights", "Transcript"];
  const [hoverTab, setHoverTab] = useState<string | null>(null);

  const handleSaveTitle = async (newTitle: string) => {
    try {
      if (!transcript.id) return;
      await updateDoc(doc(db, "transcripts", transcript.id), { title: newTitle });
      setTitle(newTitle);
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

      {/* Tabs Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "50%",
          margin: "0 auto",
          position: "relative",
          paddingBottom: "8px",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab}
            style={{
              position: "relative",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: hoverTab === tab ? "normal" : subPage === tab ? "bold" : "normal",
              color: hoverTab === tab || subPage === tab ? "#000" : "#666",
              transition: "color 0.2s ease-in-out, font-weight 0.2s ease-in-out",
              paddingBottom: "6px",
            }}
            onClick={() => setSubPage(tab as "Transcript" | "Highlights")}
            onMouseEnter={() => setHoverTab(tab)}
            onMouseLeave={() => setHoverTab(null)}
          >
            {tab}
          </div>
        ))}

        {/* Single Connected Underline */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: hoverTab ? (hoverTab === "Transcript" ? "50%" : "0%") : subPage === "Transcript" ? "50%" : "0%",
            width: "50%", // Span across both tabs
            height: hoverTab ? "3px" : "2px",
            backgroundColor: hoverTab ? "#000" : "#ccc",
            transition: "left 0.2s ease-in-out, background-color 0.2s ease-in-out, height 0.2s ease-in-out",
          }}
        />
      </div>

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
