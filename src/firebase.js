// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjOvgyeuK2s6hC0E7xrXMg4-axA1VTfNM",
  authDomain: "peopleync.firebaseapp.com",
  projectId: "peopleync",
  storageBucket: "peopleync.firebasestorage.app",
  messagingSenderId: "536395272639",
  appId: "1:536395272639:web:c603b0f24c44a1b7a5910a",
  measurementId: "G-2MZQ6PW5F3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);  // Initialize Firestore

// Export the Firestore instance so it can be used in other parts of your app
export { db };
