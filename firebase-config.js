/**
 * Firebase Firestore Configuration & Integration for Wedding Blessings
 * 
 * Replace the firebaseConfig values below with your Firebase Project credentials
 * from https://console.firebase.google.com/
 */

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "jyotishman-weds.firebaseapp.com",
  projectId: "jyotishman-weds",
  storageBucket: "jyotishman-weds.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Check if Firebase keys are set
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let db = null;

if (typeof firebase !== 'undefined' && isFirebaseConfigured) {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("💍 Firebase Firestore initialized successfully for Jyotishman & Nitumoni's wedding!");
  } catch (error) {
    console.warn("Firebase initialization warning:", error);
  }
}

