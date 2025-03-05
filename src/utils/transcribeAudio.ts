export const transcribeAudio = async (audioBlob: Blob) => {
  console.log("Audio Blob type:", audioBlob.type);

  // Detect Safari using the user agent
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // If Safari, override the MIME type to match the actual container (M4A)
  let finalBlob = audioBlob;
  let extension = audioBlob.type.split("/")[1] || "webm";

  const fileName = `recording.${extension}`;
  const formData = new FormData();
  formData.append("audio", finalBlob, fileName);

  const localURL = "http://127.0.0.1:5001/ny-edtech-hackathon/us-central1/api/transcribe";
  const remoteURL = "https://api-h3dz3ibkuq-uc.a.run.app/transcribe";

  const urlToUse = remoteURL;

  try {
    const response = await fetch(urlToUse, {
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
