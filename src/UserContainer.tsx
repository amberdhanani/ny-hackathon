import React, { useState, useRef } from "react";
import { Button } from "@mui/material";
import NavBar from "./NavBar";

const url = "http://127.0.0.1:5001/ny-edtech-hackathon/us-central1/aiCall";

const UserContainer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start recording using MediaRecorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Combine all audio chunks into a single blob
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop the MediaRecorder
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Submit the recorded audio to the cloud function
  const submitAudio = async () => {
    if (!audioBlob) {
      console.error("No audio recorded");
      return;
    }

    // Prepare the file as FormData
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    // Optionally, include additional fields (e.g., chatHistory) if needed:
    // formData.append("chatHistory", JSON.stringify([...]));

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponseData(data.response);
    } catch (error) {
      console.error("Error submitting audio:", error);
    }
  };

  return (
    <div>
    
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <p>A User is Logged In.</p>
        <Button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        {audioBlob && (
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            style={{ marginTop: "1rem" }}
          />
        )}
        <Button
          onClick={submitAudio}
          disabled={!audioBlob}
          style={{ marginTop: "1rem" }}
        >
          Submit Audio
        </Button>
        {responseData && (
          <div
            style={{
              marginTop: "1rem",
              textAlign: "left",
              maxWidth: "600px",
            }}
          >
            <h3>AI Response:</h3>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserContainer;
