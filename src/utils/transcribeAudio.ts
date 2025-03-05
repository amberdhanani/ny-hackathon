export const transcribeAudio = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  try {
    const response = await fetch("https://api-h3dz3ibkuq-uc.a.run.app/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to transcribe audio");

    const data = await response.json();
    console.log("The data is:", data);

    return {
      sentences: typeof data.analysis === "string" ? JSON.parse(data.analysis) : data.analysis,
      title: data.title || "Recording",
      duration: data.duration || 0,
    };
  } catch (error) {
    console.error("Error during transcription:", error);
    throw error;
  }
};
