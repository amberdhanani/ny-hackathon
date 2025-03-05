import React, { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import Lottie from "lottie-react";
import recordingAnimation from "../../assets/recording.json"; // Ensure the correct path
import loadingAnimation from "../../assets/loading-animation.json"; // Ensure the correct path

import { selectedTranscriptAtom, transcriptsAtom } from "../../recoil/atoms";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { transcribeAudio } from "../../utils/transcribeAudio";
import { saveTranscript } from "../../utils/saveTranscript";

const transcribingMessages = [
  "Converting your audio...",
  "Working through who said what...",
  "Scanning for growth mindset...",
  "Identifying key moments...",
  "Enhancing clarity and structure...",
  "Detecting speaker emotions...",
  "Summarizing core insights...",
  "Finalizing your transcript...",
];

const NewRecordingContainer: React.FC = () => {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const setSelectedTranscript = useSetRecoilState(selectedTranscriptAtom);
  const setTranscripts = useSetRecoilState(transcriptsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (isTranscribing) {
      const interval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % transcribingMessages.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isTranscribing]);

  const handleStopRecording = async () => {
    setIsTranscribing(true);
    const audioBlob = await stopRecording();

    if (!audioBlob || audioBlob.size === 0) {
      console.error("Empty audio blob; aborting upload.");
      setIsTranscribing(false);
      return;
    }

    try {
      const results = await transcribeAudio(audioBlob);
      console.log("✅ Transcription result:", results);

      const { sentences, title, duration } = results;

      const transcriptRecord = await saveTranscript({
        sentences,
        createdAt: new Date().toISOString(),
        title,
        duration,
      });

      setSelectedTranscript(transcriptRecord);
      setTranscripts((prev) => [transcriptRecord, ...prev]);
      navigate("/transcript");
    } catch (error) {
      console.error("Error processing transcription:", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh", // Full viewport height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Centers vertically
        alignItems: "center", // Centers horizontally
        textAlign: "center",
      }}
    >
      {isRecording && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <Lottie animationData={recordingAnimation} loop style={{ width: 450, height: 450 }} />
        </Box>
      )}

      {isTranscribing && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
          <Lottie animationData={loadingAnimation} loop style={{ width: 450, height: 450 }} />
          <Typography variant="subtitle1" sx={{ marginTop: 0, fontWeight: "bold" }}>
            {transcribingMessages[messageIndex]}
          </Typography>
        </Box>
      )}

      {/* Display the SVG image when not recording or transcribing */}
      {!isRecording && !isTranscribing && (
        <Box sx={{ width: "75%", maxWidth: "900px", marginBottom: "20px" }}>
          <img
            src="/assets/recordingmsg.svg"
            alt="Recording Message"
            style={{
              width: "100%", // Takes full width of parent (75% of screen)
              height: "auto",
              display: "block",
            }}
          />
        </Box>
      )}

      {/* Centered Button */}
      <Button
        variant="contained"
        onClick={isRecording ? handleStopRecording : startRecording}
        sx={{
          display: "flex",
          padding: "12px 16px",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          borderRadius: "8px",
          border: "1px solid #030217",
          backgroundColor: isRecording ? "rgba(233, 26, 71, 0.1)" : "#4F46E5", // 10% opacity red for stop, purple for start
          boxShadow: "2px 2px 0px 0px #030217",
          fontSize: "16px",
          color: isRecording ? "#E91A47" : "#fff", // Solid red text for stop, white for start
          textTransform: "none",
          "&:hover": {
            backgroundColor: isRecording ? "rgba(233, 26, 71, 0.2)" : "#4338CA", // Slightly darker on hover
            boxShadow: "2px 2px 0px 0px #030217",
          },
          "&:active": {
            transform: "translate(1px, 1px)",
            boxShadow: "1px 1px 0px 0px #030217",
          },
        }}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
    </Box>
  );
};

export default NewRecordingContainer;
