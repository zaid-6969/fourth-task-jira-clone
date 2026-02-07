import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0dz85WHuo-nYvbuXlVatNi1kP7f32ZfI",
  authDomain: "auth-e9cf8.firebaseapp.com",
  projectId: "auth-e9cf8",
  storageBucket: "auth-e9cf8.appspot.com", // ✅ FIXED
  messagingSenderId: "1076805857812",
  appId: "1:1076805857812:web:62c9260df5a7de34c56d01",
  measurementId: "G-WELXRM43MB",
};

const app = initializeApp(firebaseConfig);

// Optional analytics
getAnalytics(app);

// 🔐 AUTH
export const auth = getAuth(app);
signInAnonymously(auth).catch(console.error); // ✅ THIS IS THE KEY

// 🔥 FIRESTORE
export const db = getFirestore(app);

// 🖼️ STORAGE
export const storage = getStorage(app);

// Google login (optional, not required now)
export const googleProvider = new GoogleAuthProvider();
