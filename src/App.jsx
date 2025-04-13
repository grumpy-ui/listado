import { useEffect, useState, useRef } from "react";
import BurgerMenu from "./BurgerMenu";
import AuthPopup from "./AuthPopup";
import { useNavigate, useParams } from "react-router-dom";
import { auth, signOut } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createNewList, subscribeToList, updateList } from "./lib/firestore";
import "./App.css";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [unit, setUnit] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareRef = useRef();

  const translations = {
    en: {
      title: "Shopping List",
      placeholder: "Add item...",
      share: "Share",
      newList: "New List",
      linkAlert: "Link copied to clipboard",
      qtyPlaceholder: "Qty",
      unitPlaceholder: "Unit",
      add: "Add",
      copyLink: "Copy Link",
    },
    ro: {
      title: "Lista de cumpărături",
      placeholder: "Adaugă produs...",
      share: "Trimite",
      newList: "Listă Nouă",
      linkAlert: "Link copiat in clipboard",
      qtyPlaceholder: "Cant.",
      unitPlaceholder: "Unitate",
      add: "Adaugă",
      copyLink: "Copiază linkul",
    },
    es: {
      title: "Lista de compras",
      placeholder: "Agregar producto...",
      share: "Compartir",
      newList: "Lista Nueva",
      linkAlert: "Enlace copiado al portapapeles",
      qtyPlaceholder: "Cant.",
      unitPlaceholder: "Unidad",
      add: "Añadir",
      copyLink: "Copiar enlace",
    },
  };

  const [language, setLanguage] = useState("en");
  const t = translations[language];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isVerified =
        user?.emailVerified ||
        user?.providerData[0]?.providerId !== "password";

      if (user && isVerified) {
        setUser(user);
      } else {
        setUser(null);
        if (user) signOut(auth); // Force sign-out if unverified
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!id) return;
    if (id === "new") {
      createNewList().then((newId) => navigate(`/list/${newId}`));
      return;
    }
    const unsubscribe = subscribeToList(id, (data) =>
      setItems(data.items || [])
    );
    return () => unsubscribe();
  }, [id, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShareOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortItems = (arr) => [...arr].sort((a, b) => a.bought - b.bought);

  const addItem = () => {
    if (!input.trim()) return;
    const newItem = {
      text: input.trim(),
      quantity: quantity.trim() ? parseInt(quantity) : 1,
      unit: unit.trim(),
      bought: false,
    };
    const updatedItems = sortItems([...items, newItem]);
    setItems(updatedItems);
    updateList(id, updatedItems);
    setInput("");
    setQuantity("");
    setUnit("");
  };

  const toggleItem = (index) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, bought: !item.bought } : item
    );
    const sorted = sortItems(newItems);
    setItems(sorted);
    updateList(id, sorted);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    updateList(id, updatedItems);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert(t.linkAlert))
      .catch(() => alert("Failed to copy link"));
  };

  const handleNewList = () => {
    createNewList().then((newId) => {
      navigate(`/list/${newId}`);
      setItems([]);
      setInput("");
    });
  };

  return (
    <div className="app">
      <div className="burger-icon">
        <button onClick={() => setIsMenuOpen(true)}>🍔</button>
      </div>

      <div className="container">
        <h1>{t.title}</h1>
        <div className="controls">
          <button onClick={handleNewList}>🆕 {t.newList}</button>
          <div className="share-wrapper" ref={shareRef}>
            <button onClick={() => setShowShareOptions((prev) => !prev)}>
              🔗 {t.share}
            </button>
            {showShareOptions && (
              <div className="share-options">
                <button onClick={copyToClipboard}>📋 {t.copyLink}</button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🟢 WhatsApp
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔵 Telegram
                </a>
                <a href={`sms:?body=${encodeURIComponent(window.location.href)}`}>
                  💬 SMS
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="input-bar">
          <input
            type="text"
            placeholder={t.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <div className="input-row">
            <input
              type="number"
              placeholder={t.qtyPlaceholder}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
            />
            <input
              type="text"
              placeholder={t.unitPlaceholder}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
            />
          </div>
          <button className="add-button" onClick={addItem}>
            {t.add}
          </button>
        </div>

        <ul className="list">
          {items.map((item, index) => (
            <li key={index} className={item.bought ? "bought" : ""}>
              <div onClick={() => toggleItem(index)}>
                <input type="checkbox" checked={item.bought} readOnly />
                <span>
                  {item.text}
                  {item.quantity > 1 || item.unit
                    ? ` — ${item.quantity} ${item.unit || ""}`
                    : ""}
                </span>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDeleteItem(index)}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>

      <BurgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        language={language}
        setLanguage={setLanguage}
        handleLogout={() => signOut(auth)}
        user={user}
        setIsAuthOpen={setIsAuthOpen}
      />

      {isAuthOpen && (
        <AuthPopup onClose={() => setIsAuthOpen(false)} setUser={setUser} />
      )}
    </div>
  );
}

export default App;
