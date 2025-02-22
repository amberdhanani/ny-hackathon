import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, provider as googleAuthProvider } from "../firebaseConfig";

const LoginPage = () => {
  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleAuthProvider);
      if (user) {
        console.log("user was found");
      } else {
        console.log("user was not found");
      }
    } catch (error: any) {}
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login Page</h2>
      <button onClick={signInWithGoogle} style={styles.button}>
        Sign in with Google
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4285F4",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default LoginPage;
