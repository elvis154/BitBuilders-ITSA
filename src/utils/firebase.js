import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZbiRBAjt24wLvfTPdwTM4_bo3sQcsPGk",
  authDomain: "hacktivate-8e18d.firebaseapp.com",
  projectId: "hacktivate-8e18d",
  storageBucket: "hacktivate-8e18d.appspot.com",
  messagingSenderId: "209411398304",
  appId: "1:209411398304:web:e8eebf7b0f1f2c06d747c5",
  measurementId: "G-01KHBPGHXB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);  // Firestore for storing chat data
export const storage = getStorage(app);