import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvObY91Fb6qHdt-t6P_SWxzEzEYk6iKFY",
  authDomain: "lahiru-web.firebaseapp.com",
  projectId: "lahiru-web",
  storageBucket: "lahiru-web.firebasestorage.app",
  messagingSenderId: "143894632856",
  appId: "1:143894632856:web:e4cd93558cdf7b36ff73ed",
  measurementId: "G-F4SK379H25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth, firebaseConfig };
