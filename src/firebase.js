import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 1. Must have this import

const firebaseConfig = {
  apiKey: "AIzaSyBqES8CXKRI4ft33Q7f5WIs9mRMVW4IQdU",
  authDomain: "kalpavruksha-d88a4.firebaseapp.com",
  projectId: "kalpavruksha-d88a4",
  storageBucket: "kalpavruksha-d88a4.firebasestorage.app",
  messagingSenderId: "174503113616",
  appId: "1:174503113616:web:dd6e9578edd1a0fe51b915",
  measurementId: "G-HV5E99E5FJ"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); // 2. MUST have this exact export