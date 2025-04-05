import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEGOC5g8eeQvTOrNpqBz8yKtF3gmhyvCc",
  authDomain: "household-manager-99f7c.firebaseapp.com",
  projectId: "household-manager-99f7c",
  storageBucket: "household-manager-99f7c.firebasestorage.app",
  messagingSenderId: "430442057672",
  appId: "1:430442057672:web:b318e9597dbd0c49a5fafd",
  measurementId: "G-01FV2PL8EK",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();


export {
  db,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  signOut
};