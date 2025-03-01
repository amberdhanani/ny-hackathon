import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Lottie from "lottie-react";
import recordingAnimation from "../../assets/recording.json"; // Ensure the correct path

import { selectedTranscriptAtom, transcriptsAtom } from "../../recoil/atoms";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { transcribeAudio } from "../../utils/transcribeAudio";
import { saveTranscript } from "../../utils/saveTranscript";

const NewRecordingContainer: React.FC = () => {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const setSelectedTranscript = useSetRecoilState(selectedTranscriptAtom);
  const setTranscripts = useSetRecoilState(transcriptsAtom);
  const navigate = useNavigate();

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
        <Lottie
          animationData={recordingAnimation}
          loop
          style={{ width: 150, height: 150 }}
        />
      )}
      
      {isRecording && <h3>Recording...</h3>}
      {isTranscribing && <p>Transcribing...</p>}

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
