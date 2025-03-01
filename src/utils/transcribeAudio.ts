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
    console.log("The data is:", data);
    return {
      sentences: JSON.parse(data.analysis) || "Analysis Failed",
      title: JSON.parse(data.title) || "Recording",
      duration: data.duration ? JSON.parse(data.duration) : 0,
    };
  } catch (error) {
    console.error("Error during transcription:", error);
    throw error;
  }
};
