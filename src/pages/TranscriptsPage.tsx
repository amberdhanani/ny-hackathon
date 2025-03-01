import React from "react";
import NavBar from "../NavBar";
import TranscriptsContainer from "../components/transcripts/TranscriptsContainer";

const TranscriptsPage = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <NavBar title="Transcript" />
      <TranscriptsContainer />
    </div>
  );
};

export default TranscriptsPage;
