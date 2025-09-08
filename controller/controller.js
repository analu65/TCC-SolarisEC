// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARAEft5qjY41kS0twRf85NbPElCy7OAhE",
  authDomain: "tcc---solaris.firebaseapp.com",
  projectId: "tcc---solaris",
  storageBucket: "tcc---solaris.firebasestorage.app",
  messagingSenderId: "346963626274",
  appId: "1:346963626274:web:7c8bc69b80e17242f1bd7b",
  measurementId: "G-LDJ9D7F0MD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);