//Updated NewRecordingContainer.tsx

import { addDoc, collection } from "firebase/firestore";
import React, { useState, useRef } from "react";
import { db } from "../../firebaseConfig";
import { TranscriptEntry, TranscriptRecord } from "../../types/types";
import { Button } from "@mui/material";
import { useSetRecoilState } from "recoil";
import { selectedTranscriptAtom } from "../../recoil/atoms";
import { useNavigate } from "react-router-dom";


const NewRecordingContainer: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const setSelectedTranscript = useSetRecoilState(selectedTranscriptAtom);
  const navigate = useNavigate();



  const startRecording = async () => {
    try {
      // Clear previous download URL
      setDownloadUrl(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      console.log("Recording started");
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    setIsTranscribing(true);
    setIsRecording(false);

    // Wrap onstop in a promise to ensure we get the final Blob.
    const audioBlob: Blob = await new Promise((resolve, reject) => {
      mediaRecorderRef.current!.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        resolve(blob);
      };
      mediaRecorderRef.current!.onerror = (e) => reject(e);
      mediaRecorderRef.current!.stop();
    });

    console.log("Recorded blob size:", audioBlob.size);
    if (audioBlob.size === 0) {
      console.error("Empty audio blob; aborting upload.");
      return;
    }

    // Create a download URL so the file can be saved locally.
    const url = URL.createObjectURL(audioBlob);
    setDownloadUrl(url);

    // Build FormData and send the file to your cloud function.
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    console.log("Sending FormData to transcription endpoint...");
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/ny-edtech-hackathon/us-central1/api/transcribe",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      const analysisData = JSON.parse(data.analysis);
      const record: TranscriptRecord = {
        sentences: analysisData,
        createdAt: new Date().toISOString(),
        title: "Recording",
      };
      const colRef= collection(db, "transcripts");
      const createdDoc = await addDoc(colRef, record);
      // write code that gets the id of the newly created record
      setSelectedTranscript({ ...record, id: createdDoc.id });
      setIsTranscribing(false);
      navigate("/transcript")
    } catch (error) {
      console.error("Error during transcription:", error);
    }

    
  };

  return (
    <div>
      {isRecording && (
        <div>
          {/* Only shows if recording, replace with your LotieFile */}
          <h3>Recording...</h3>
        </div>
      )}
      {isTranscribing && (
        <div><p>Transcribing</p></div>
      )}
      <div style={{ display: "flex", justifyContent: "center"}}>
      <Button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      </div>
    </div>
  );
};

export default NewRecordingContainer