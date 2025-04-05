import React, { useState } from "react";
import "./BurgerMenu.css";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
} from "./firebase";

const BurgerMenu = ({ isOpen, onClose, language, setLanguage, user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register

  const handleEmailAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      alert(err.message);
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

  return (
    <div className={`burger-menu ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>
        ✖
      </button>

      {user ? (
        <div className="menu-section">
          <span className="logged-in-msg">👤 Logged in as {user.email}</span>
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
          <button className="menu-btn login-btn" onClick={handleEmailAuth}>
            {isLogin ? "🔑 Log In" : "📝 Register"}
          </button>
          <button className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create new account" : "Already have an account?"}
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
