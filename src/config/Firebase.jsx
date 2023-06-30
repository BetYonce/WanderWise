// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from  "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
 
const firebaseConfig = {
  apiKey: "AIzaSyDt3JCEkbd05oWED4WwYilGlp6wHMjM-Jo",
  authDomain: "wanderwise-34fdd.firebaseapp.com",
  projectId: "wanderwise-34fdd",
  storageBucket: "wanderwise-34fdd.appspot.com",
  messagingSenderId: "844402518731",
  appId: "1:844402518731:web:9fe48b368666a9da2f894e",
  measurementId: "G-DZYR8X4RKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// This line initializes Firestore and exports it as 'db'
export const db = getFirestore(app);

export const storage = getStorage(app);
