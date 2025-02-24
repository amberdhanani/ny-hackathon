import { addDoc, collection } from "firebase/firestore";
import React, { useState, useRef } from "react";
import { db } from "../../firebaseConfig";
import { TranscriptEntry, TranscriptRecord } from "../../types/types";


const NewRecordingContainer: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);



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
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

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
      addDoc(colRef, record);
      setTranscript(analysisData);
    } catch (error) {
      console.error("Error during transcription:", error);
    }

    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <div>
        <h3>Transcript:</h3>
        <div style={styles.container}>
          {transcript.map((entry, index) => (
            <div
              key={index}
              style={{
                ...styles.sentence,
                ...(entry.userLabel === 'teacher'
                  ? styles.teacher
                  : styles.student),
              }}
              className="transcript-sentence"
            >
              <span style={styles.label}>{entry.userLabel}:</span>{' '}
              <span style = {entry.flag==="negative"?styles.negativeText:entry.flag==="positive"? styles.positiveText:styles.text}>
              {entry.transcribed}
              </span>
            </div>
          ))}
          {/* Inline style for hover effect */}
          <style>{`
        .transcript-sentence:hover {
          text-decoration: underline;
        }
      `}</style>
        </div>
      </div>
      {downloadUrl && (
        <div>
          <h3>Download Recording</h3>
          <a href={downloadUrl} download="recording.webm">
            Download recording.webm
          </a>
        </div>
      )}
    </div>
  );
};

export default NewRecordingContainer

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6,
    margin: '20px',
  },
  sentence: {
    marginBottom: '10px',
    padding: '10px',
    cursor: 'pointer',
    transition: 'text-decoration 0.2s',
  },
  teacher: {
    backgroundColor: '#f0f8ff',
    borderLeft: '3px solid #1e90ff',
    paddingLeft: '10px',
  },
  student: {
    backgroundColor: '#fff8dc',
    borderLeft: '3px solid #ffa500',
    paddingLeft: '10px',
  },
  label: {
    fontWeight: 'bold',
  },

  text: {
    color: 'black',
  },
  negativeText: {
    color: 'red',
  },
  positiveText: {
    color: 'green',
  },  
};