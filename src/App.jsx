import { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createNewList, subscribeToList, updateList } from "./lib/firestore";
import "./App.css";
function App() {
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
      footer: "Made with ❤️ by Radu",
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
      footer: "Făcut cu ❤️ de Radu",
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
      footer: "Hecho con ❤️ por Radu",
      linkAlert: "Enlace copiado al portapapeles",
      qtyPlaceholder: "Cant.",
      unitPlaceholder: "Unidad",
      add: "Añadir",
      copyLink: "Copiar enlace",
    },
  };

  const [language, setLanguage] = useState("en");
  const t = translations[language];

  // Inside your component
  useEffect(() => {
    const existing = document.getElementById("bmc-wjs");
    if (existing) return; // Prevent multiple injections

    const script = document.createElement("script");
    script.id = "bmc-wjs";
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-id", "radut");
    script.setAttribute("data-description", "Support me on Buy me a coffee!");
    script.setAttribute("data-message", "Buy me a coffee");
    script.setAttribute("data-color", "#5F7FFF");
    script.setAttribute("data-position", "Right");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const script = document.getElementById("bmc-wjs");
      if (script) script.remove();
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    if (id === "new") {
      createNewList().then((newId) => {
        navigate(`/list/${newId}`);
      });
      return;
    }

    const unsubscribe = subscribeToList(id, (data) => {
      setItems(data.items || []);
    });

    return () => unsubscribe();
  }, [id, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortItems = (arr) => {
    return [...arr].sort((a, b) => a.bought - b.bought);
  };

  const addItem = () => {
    if (input.trim() === "") return;
    const qty = quantity.trim() === "" ? 1 : parseInt(quantity);
    const unitValue = unit.trim();
    const newItems = sortItems([
      ...items,
      {
        text: input.trim(),
        quantity: qty,
        unit: unitValue,
        bought: false,
      },
    ]);
    setItems(newItems);
    updateList(id, newItems);

    setInput("");
    setQuantity("");
    setUnit("");
  };

  const toggleItem = (index) => {
    const newItems = [...items];
    newItems[index].bought = !newItems[index].bought;
    const sorted = sortItems(newItems);
    setItems(sorted);
    updateList(id, sorted);
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    const sorted = sortItems(newItems);
    setItems(sorted);
    updateList(id, sorted);
  };

  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);

  const shareOptions = {
    whatsapp: `https://wa.me/?text=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}`,
    sms: `sms:?body=${encodedUrl}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => alert(t.linkAlert))
      .catch(() => alert("Failed to copy link"));
  };

  const openPopup = (link) => {
    window.open(link, "_blank", "width=500,height=500");
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
      <div className="language-selector">
        <button
          onClick={() => setLanguage("en")}
          className={language === "en" ? "active" : ""}
        >
          🇬🇧
        </button>
        <button
          onClick={() => setLanguage("ro")}
          className={language === "ro" ? "active" : ""}
        >
          🇷🇴
        </button>
        <button
          onClick={() => setLanguage("es")}
          className={language === "es" ? "active" : ""}
        >
          🇪🇸
        </button>
      </div>

      <div className="container">
        <h1>{t.title}</h1>

        <div className="controls">
          <button onClick={handleNewList}>🆕 {t.newList}</button>
          <div className="share-wrapper" ref={shareRef}>
            <button onClick={() => setShowShareOptions(!showShareOptions)}>
              🔗 {t.share}
            </button>

            {showShareOptions && (
              <div className="share-options">
                <button onClick={copyToClipboard}>📋 {t.copyLink}</button>
                <a
                  href={shareOptions.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🟢 WhatsApp
                </a>
                <a
                  href={shareOptions.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔵 Telegram
                </a>
                <a href={shareOptions.sms}>💬 SMS</a>
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
            className="item-name-input"
          />

          <div className="input-row">
            <input
              type="number"
              placeholder={t.qtyPlaceholder}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              className="quantity-input"
            />
            <input
              type="text"
              placeholder={t.unitPlaceholder}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              className="unit-input"
            />
          </div>

          <button className="add-button" onClick={addItem}>
            {t.add}
          </button>
        </div>

        <ul className="list">
          {items.map((item, index) => (
            <li key={index} className={item.bought ? "bought" : ""}>
              <div className="item-content" onClick={() => toggleItem(index)}>
                <input type="checkbox" checked={item.bought} readOnly />
                <span>
                  {item.text}
                  {item.quantity > 1 || item.unit
                    ? ` — ${item.quantity}${item.unit ? " " + item.unit : ""}`
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
      <a
        href="https://www.buymeacoffee.com/radut"
        target="_blank"
        rel="noopener noreferrer"
        className="bmc-button"
        aria-label="Buy me a coffee"
      >
        ☕
      </a>
    </div>
  );
}

export default App;
