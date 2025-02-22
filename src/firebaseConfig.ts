// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfUcdhuvOPe4RG_B6DTFyZTxiQxBRJtto",
  authDomain: "ny-edtech-hackathon.firebaseapp.com",
  projectId: "ny-edtech-hackathon",
  storageBucket: "ny-edtech-hackathon.firebasestorage.app",
  messagingSenderId: "950478250941",
  appId: "1:950478250941:web:82985e27c8d4caf42c68d4",
  measurementId: "G-YMFZQVSVM7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore();
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
