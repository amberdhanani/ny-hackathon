export const transcribeAudio = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  try {
    const response = await fetch("http://127.0.0.1:5001/ny-edtech-hackathon/us-central1/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to transcribe audio");

    const data = await response.json();
    return {
      sentences: JSON.parse(data.analysis),
      title: JSON.parse(data.title) || "Recording",
    };
  } catch (error) {
    console.error("Error during transcription:", error);
    throw error;
  }
};
