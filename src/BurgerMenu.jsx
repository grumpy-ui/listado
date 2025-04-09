import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./BurgerMenu.css";
import { auth, signInWithEmailAndPassword, signInWithPopup, googleProvider, signOut } from "./firebase";

const BurgerMenu = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  user,
  handleLogout,

}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        alert("Please verify your email first. Check your inbox.");
        await signOut(auth);
      } else {
        onClose();
      }
    } catch (err) {
      if (err.code === "auth/invalid-login-credentials") {
        alert("Invalid credentials, please try again.");
      } else {
        alert(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
    onClose();
  };

  return (
    <div className={`burger-menu ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>✖</button>

      {user ? (
        <div className="menu-section auth-section">
          <span className="logged-in-msg">👤 Logged in as {user.email}</span>
          <button className="menu-btn login-btn" onClick={() => { handleLogout(); onClose(); }}>
            🚪 Log Out
          </button>
        </div>
      ) : (
        <div className="menu-section auth-section">
          <button className="menu-btn google-btn" onClick={handleGoogleLogin}>
            🔑 Continue with Google
          </button>

          <div className="divider">or</div>

          <input
            type="email"
            placeholder="Email"
            className="menu-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="menu-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="menu-btn login-btn" onClick={handleEmailLogin}>
            🔑 Log In
          </button>

          <button className="menu-btn" onClick={handleSignUpClick}>
            Create new account
          </button>
        </div>
      )}

      <div className="menu-section">
        <button className="menu-btn hide">📜 History</button>
        <button className="menu-btn">☕ Donate</button>
      </div>

      <div className="menu-section">
        <span className="menu-label">🌐 Language:</span>
        <div className="language-options">
          <button className={`lang-btn ${language === "en" ? "active" : ""}`} onClick={() => setLanguage("en")}>🇬🇧</button>
          <button className={`lang-btn ${language === "ro" ? "active" : ""}`} onClick={() => setLanguage("ro")}>🇷🇴</button>
          <button className={`lang-btn ${language === "es" ? "active" : ""}`} onClick={() => setLanguage("es")}>🇪🇸</button>
        </div>
      </div>

      <div className="menu-section">
        <button className="menu-btn">ℹ️ About</button>
      </div>
    </div>
  );
};

export default BurgerMenu;