import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEGOC5g8eeQvTOrNpqBz8yKtF3gmhyvCc",
  authDomain: "household-manager-99f7c.firebaseapp.com",
  projectId: "household-manager-99f7c",
  storageBucket: "household-manager-99f7c.firebasestorage.app",
  messagingSenderId: "430442057672",
  appId: "1:430442057672:web:b318e9597dbd0c49a5fafd",
  measurementId: "G-01FV2PL8EK",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app.name);

const db = getFirestore(app);
const auth = getAuth(app);

// Configure Google provider for better mobile support
const googleProvider = new GoogleAuthProvider();

// Configure Google provider for better mobile support
googleProvider.setCustomParameters({
  prompt: "select_account",
  // Add these parameters for better mobile compatibility
  access_type: "offline",
  include_granted_scopes: true,
});

// Add scopes if needed
googleProvider.addScope("email");
googleProvider.addScope("profile");

// Log auth configuration
console.log("Auth domain:", firebaseConfig.authDomain);
console.log("Google provider configured");

// Use auth emulator in development
if (import.meta.env.DEV) {
  // Uncomment the line below if you want to use Firebase Auth Emulator
  // connectAuthEmulator(auth, "http://localhost:9099");
}

export { db, auth, googleProvider };
