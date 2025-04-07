import React, { useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  signOut,
} from "./firebase";
import { sendEmailVerification } from "firebase/auth";
import "./BurgerMenu.css";

const AuthPopup = ({ onClose, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleEmailAuth = async () => {
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          alert("Please verify your email.");
          await signOut(auth);
        } else {
          setUser(userCredential.user);
          onClose();
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        alert("Verification email sent. Please verify and log in.");
        await signOut(auth);
        onClose();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="burger-menu open">
      <button className="close-btn" onClick={onClose}>✖</button>
      <div className="menu-section auth-section">
        <button className="menu-btn google-btn" onClick={handleGoogleLogin}>
          🔑 Continue with Google
        </button>
        <div className="divider">or</div>
        <input type="email" placeholder="Email" className="menu-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="menu-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="menu-btn login-btn" onClick={handleEmailAuth}>
          {isLogin ? "🔑 Log In" : "📝 Register"}
        </button>
        <button className="menu-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create new account" : "Already have an account?"}
        </button>
      </div>
    </div>
  );
};

export default AuthPopup;