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
      const { sentences, title, duration } = await transcribeAudio(audioBlob);
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
    <div style={{ textAlign: "center", marginTop: "20px" }}>
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

      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <Button
          variant="contained"
          color={isRecording ? "secondary" : "primary"}
          onClick={isRecording ? handleStopRecording : startRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>
    </div>
  );
};

export default NewRecordingContainer;
