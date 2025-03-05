import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, provider as googleAuthProvider } from "../firebaseConfig";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

const LoginPage: React.FC = () => {
  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleAuthProvider);
      if (user) {
        console.log("User signed in:", user.displayName);
      } else {
        console.log("No user found.");
      }
    } catch (error: any) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(rgba(79, 70, 230, 0.06), rgba(255,255,255, 0.7))",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          textAlign: "center",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo at the top */}
        <Box
          component="img"
          src="/assets/logo-words.svg"
          alt="Company Logo"
          sx={{ height: "80px", marginBottom: "20px" }}
        />

        {/* Inactive Email & Password Fields */}
        <TextField label="Email" variant="outlined" fullWidth margin="normal" disabled />
        <TextField label="Password" variant="outlined" type="password" fullWidth margin="normal" disabled />

        {/* Google Sign-In Button */}
        {/* Google Sign-In Button */}
        <Button
          onClick={signInWithGoogle}
          variant="contained"
          fullWidth
          sx={{
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
          }}
        >
          Sign in with Google
        </Button>
      </Container>
    </Box>
  );
};

// ✅ Ensure Default Export
export default LoginPage;
