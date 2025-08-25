import { useState, useEffect } from "react";
import "./Options.css";

function Options({ onClose, language }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFont, setSelectedFont] = useState("patrick-hand");

  const translations = {
    en: {
      options: "Options",
      darkMode: "Dark Mode",
      font: "Font",
      close: "Close",
      patrickHand: "Patrick Hand",
      roboto: "Roboto",
      openSans: "Open Sans",
      lato: "Lato",
      montserrat: "Montserrat",
      apply: "Apply",
      reset: "Reset to Default",
    },
    ro: {
      options: "Opțiuni",
      darkMode: "Mod Întunecat",
      font: "Font",
      close: "Închide",
      patrickHand: "Patrick Hand",
      roboto: "Roboto",
      openSans: "Open Sans",
      lato: "Lato",
      montserrat: "Montserrat",
      apply: "Aplică",
      reset: "Resetează la implicit",
    },
    es: {
      options: "Opciones",
      darkMode: "Modo Oscuro",
      font: "Fuente",
      close: "Cerrar",
      patrickHand: "Patrick Hand",
      roboto: "Roboto",
      openSans: "Open Sans",
      lato: "Lato",
      montserrat: "Montserrat",
      apply: "Aplicar",
      reset: "Restablecer",
    },
  };

  const t = translations[language];

  const fonts = [
    { id: "patrick-hand", name: t.patrickHand, preview: "Aa" },
    { id: "roboto", name: t.roboto, preview: "Aa" },
    { id: "open-sans", name: t.openSans, preview: "Aa" },
    { id: "lato", name: t.lato, preview: "Aa" },
    { id: "montserrat", name: t.montserrat, preview: "Aa" },
  ];

  useEffect(() => {
    // Load saved settings from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedFont = localStorage.getItem("selectedFont") || "patrick-hand";

    setIsDarkMode(savedDarkMode);
    setSelectedFont(savedFont);

    // Apply saved settings
    applyDarkMode(savedDarkMode);
    applyFont(savedFont);
  }, []);

  const applyDarkMode = (darkMode) => {
    if (darkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  };

  const applyFont = (font) => {
    // Remove existing font classes
    document.body.classList.remove(
      "font-patrick-hand",
      "font-roboto",
      "font-open-sans",
      "font-lato",
      "font-montserrat"
    );
    // Add new font class
    document.body.classList.add(`font-${font}`);
  };

  const handleDarkModeToggle = (darkMode) => {
    setIsDarkMode(darkMode);
    applyDarkMode(darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  };

  const handleFontChange = (font) => {
    setSelectedFont(font);
    applyFont(font);
    localStorage.setItem("selectedFont", font);
  };

  const handleReset = () => {
    handleDarkModeToggle(false);
    handleFontChange("patrick-hand");
  };

  return (
    <div className="options-modal">
      <div className="options-content">
        <div className="options-header">
          <h2>{t.options}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="options-body">
          {/* Dark Mode Toggle */}
          <div className="options-section">
            <h3>{t.darkMode}</h3>
            <div className="toggle-container">
              <button
                className={`toggle-option ${!isDarkMode ? "selected" : ""}`}
                onClick={() => handleDarkModeToggle(false)}
              >
                <div className="toggle-preview">☀️</div>
                <div className="toggle-name">Light</div>
              </button>
              <button
                className={`toggle-option ${isDarkMode ? "selected" : ""}`}
                onClick={() => handleDarkModeToggle(true)}
              >
                <div className="toggle-preview">🌙</div>
                <div className="toggle-name">Dark</div>
              </button>
            </div>
          </div>

          {/* Font Section */}
          <div className="options-section">
            <h3>{t.font}</h3>
            <div className="options-grid">
              {fonts.map((font) => (
                <button
                  key={font.id}
                  className={`option-item font-${font.id} ${
                    selectedFont === font.id ? "selected" : ""
                  }`}
                  onClick={() => handleFontChange(font.id)}
                >
                  <div className="option-preview">{font.preview}</div>
                  <div className="option-name">{font.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="options-actions">
            <button className="reset-button" onClick={handleReset}>
              {t.reset}
            </button>
            <button className="apply-button" onClick={onClose}>
              {t.apply}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Options;
