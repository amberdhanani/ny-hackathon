import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GoToNewRecording = () => {
  const navigate = useNavigate();
  return (
    <Box sx={styles.container}>
      <img src="/assets/wave-sound.svg" alt="wave sound" style={styles.image} />
      <Box>
        <Typography sx={styles.text}>
          Make a new recording, we turn it into a transcript and highlight suggestions to improve using Growth Mindset
          Language.
        </Typography>
        <Box sx={styles.buttonWrapper}>
          <Button
            onClick={() => navigate("/new-recording")}
            variant="contained"
            sx={styles.button}
            startIcon={<img src="/assets/mic.svg" alt="mic icon" />}
          >
            Start recording
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    gap: 2,
    padding: 3,
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: "auto",
  },
  text: {
    fontSize: 16,
    color: "#333",
    maxWidth: "500px",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: 2,
  },
  button: {
    display: "flex",
    padding: "12px 16px",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    borderRadius: "8px",
    border: "1px solid #030217",
    backgroundColor: "#4F46E5",
    boxShadow: "2px 2px 0px 0px #030217",
    fontSize: "16px",
    color: "#fff",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#4338CA",
      boxShadow: "2px 2px 0px 0px #030217",
    },
    "&:active": {
      transform: "translate(1px, 1px)",
      boxShadow: "1px 1px 0px 0px #030217",
    },
  },
};

export default GoToNewRecording;
