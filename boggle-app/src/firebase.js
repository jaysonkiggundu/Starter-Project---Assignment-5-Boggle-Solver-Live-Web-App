// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuohfsZWtJ24xQF5OHBiEj4A1tFrgI4N0",
  authDomain: "boggle-e2e28.firebaseapp.com",
  projectId: "boggle-e2e28",
  storageBucket: "boggle-e2e28.firebasestorage.app",
  messagingSenderId: "960330689469",
  appId: "1:960330689469:web:ac121b065d4d833c6c00d4",
  measurementId: "G-G3WX87RG4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you’ll use
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
