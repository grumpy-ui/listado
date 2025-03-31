import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createNewList,
  getList,
  subscribeToList,
  updateList,
} from "./lib/firestore";
import "./App.css";

function App() {
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [unit, setUnit] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const translations = {
    en: {
      title: "Shopping List",
      placeholder: "Add item...",
      share: "Share",
      newList: "New List",
      footer: "Made with ❤️ by Radu",
      linkAlert: "Link copied to clipboard",
      qty: "Qty",
      unit: "Unit",
    },
    ro: {
      title: "Lista de cumpărături",
      placeholder: "Adaugă produs...",
      share: "Trimite",
      newList: "Listă Nouă",
      footer: "Făcut cu ❤️ de Radu",
      linkAlert: "Link copiat in clipboard",
      qty: "Cant.",
      unit: "Unitate",
    },
    es: {
      title: "Lista de compras",
      placeholder: "Agregar producto...",
      share: "Compartir",
      newList: "Lista Nueva",
      footer: "Hecho con ❤️ por Radu",
      linkAlert: "Enlace copiado al portapapeles",
      qty: "Cant.",
      unit: "Unidad",
    },
  };

  const [language, setLanguage] = useState("en");
  const t = translations[language];

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

  const addItem = () => {
    if (input.trim() === "") return;
    const qty = quantity.trim() === "" ? 1 : parseInt(quantity);
    const unitValue = unit.trim();
    const newItems = [
      ...items,
      {
        text: input.trim(),
        quantity: qty,
        unit: unitValue,
        bought: false,
      },
    ];
    setItems(newItems);
    updateList(id, newItems);
    setInput("");
    setQuantity("");
    setUnit("");
  };

  const toggleItem = (index) => {
    const newItems = [...items];
    newItems[index].bought = !newItems[index].bought;
    setItems(newItems);
    updateList(id, newItems);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert(t.linkAlert);
      })
      .catch(() => {
        alert("Failed to copy link");
      });
  };

  const handleNewList = () => {
    createNewList().then((newId) => {
      navigate(`/list/${newId}`);
      setItems([]); // clear UI immediately
      setInput(""); // clear input
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

        {/* <div className="share-bar">
          <button onClick={handleShare}>Share</button>
        </div> */}
        <div className="controls">
          <button onClick={handleNewList}>🆕 {t.newList}</button>
          <button onClick={handleShare}>🔗 {t.share}</button>
        </div>

        <div className="input-bar">
          <input
            type="text"
            placeholder={t.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <input
            type="number"
            placeholder= {t.qty}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            className="quantity-input"
          />
          <input
            type="text"
            placeholder= {t.unit}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            className="unit-input"
          />
          <button onClick={addItem}>+</button>
        </div>

        <ul className="list">
          {items.map((item, index) => (
            <li
              key={index}
              className={item.bought ? "bought" : ""}
              onClick={() => toggleItem(index)}
            >
              <input type="checkbox" checked={item.bought} readOnly />
              <span>
                {item.text}
                {item.quantity > 1 || item.unit
                  ? ` — ${item.quantity}${item.unit ? " " + item.unit : ""}`
                  : ""}
              </span>
            </li>
          ))}
        </ul>

        {/* <footer>Made with ❤️ by Radu</footer> */}
      </div>
    </div>
  );
}

export default App;
