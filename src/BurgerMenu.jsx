import React from "react";
import "./BurgerMenu.css";

const BurgerMenu = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  user,
  handleLogout,
  setIsAuthOpen,
}) => {
  return (
    <div className={`burger-menu ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>✖</button>

      <div className="menu-section auth-section">
        {user ? (
          <>
            <span className="logged-in-msg">👤 Logged in as {user.email}</span>
            <button
              className="menu-btn login-btn"
              onClick={() => {
                handleLogout();
                onClose();
              }}
            >
              🚪 Log Out
            </button>
          </>
        ) : (
          <button
            className="menu-btn login-btn"
            onClick={() => {
              onClose();
              setIsAuthOpen(true);
            }}
          >
            👤 Login / Register
          </button>
        )}
      </div>

      <div className="menu-section">
        <button className="menu-btn hide">📜 History</button>
        <button className="menu-btn">☕ Donate</button>
      </div>

      <div className="menu-section">
        <span className="menu-label">🌐 Language:</span>
        <div className="language-options">
          <button
            className={`lang-btn ${language === "en" ? "active" : ""}`}
            onClick={() => setLanguage("en")}
          >
            🇬🇧
          </button>
          <button
            className={`lang-btn ${language === "ro" ? "active" : ""}`}
            onClick={() => setLanguage("ro")}
          >
            🇷🇴
          </button>
          <button
            className={`lang-btn ${language === "es" ? "active" : ""}`}
            onClick={() => setLanguage("es")}
          >
            🇪🇸
          </button>
        </div>
      </div>

      <div className="menu-section">
        <button className="menu-btn">ℹ️ About</button>
      </div>
    </div>
  );
};

export default BurgerMenu;
