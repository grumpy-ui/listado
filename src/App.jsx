import { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createNewList, subscribeToList, updateList } from "./lib/firestore";
import { onAuthStateChange, initializeAuth, checkAuthSetup } from "./lib/auth";
import Account from "./components/Account";
import ListHistory from "./components/ListHistory";
import NewListModal from "./components/NewListModal";
// import { Analytics } from "@vercel/analytics/next"
import "./App.css";

// Burger Menu Component
function BurgerMenu({
  isOpen,
  onClose,
  language,
  onAccountClick,
  onHistoryClick,
  user,
}) {
  const translations = {
    en: {
      account: "Account",
      listHistory: "List History",
      options: "Options",
      coffee: "Buy me a coffee",
    },
    ro: {
      account: "Cont",
      listHistory: "Istoric liste",
      options: "Opțiuni",
      coffee: "Cumpără-mi o cafea",
    },
    es: {
      account: "Cuenta",
      listHistory: "Historial de listas",
      options: "Opciones",
      coffee: "Invítame a un café",
    },
  };

  const t = translations[language];

  const handleMenuClick = (action) => {
    // Handle menu item clicks
    switch (action) {
      case "account":
        onAccountClick();
        break;
      case "history":
        onHistoryClick();
        break;
      case "options":
        alert("Options functionality coming soon!");
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="menu-overlay" onClick={onClose}></div>}

      {/* Menu */}
      <div className={`burger-menu ${isOpen ? "open" : ""}`}>
        <div className="menu-header">
          <h3>Menu</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="menu-items">
          <button
            className="menu-item"
            onClick={() => handleMenuClick("account")}
          >
            👤 {user ? user.email : t.account}
          </button>

          <button
            className="menu-item"
            onClick={() => handleMenuClick("history")}
          >
            📋 {t.listHistory}
          </button>

          <button
            className="menu-item"
            onClick={() => handleMenuClick("options")}
          >
            ⚙️ {t.options}
          </button>

          <div className="menu-divider"></div>

          <a
            href="https://www.buymeacoffee.com/radut"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item bmc-menu-item"
            aria-label="Buy me a coffee"
          >
            ☕ {t.coffee}
          </a>
        </div>
      </div>
    </>
  );
}

function App() {
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [unit, setUnit] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showListHistory, setShowListHistory] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [user, setUser] = useState(null);
  const [currentList, setCurrentList] = useState(null);
  const [listBelongsToUser, setListBelongsToUser] = useState(false);
  const [justCreatedList, setJustCreatedList] = useState(false);
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
      coffee: "Buy me a coffee",
      createNewList: "Create New List",
      listName: "List Name",
      listNamePlaceholder: "Enter list name...",
      create: "Create",
      welcomeMessage: "Welcome! Create a new list to get started.",
      noListSelected:
        "Please select a list from your history or create a new one.",
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
      coffee: "Cumpără-mi o cafea",
      createNewList: "Creează listă nouă",
      listName: "Numele listei",
      listNamePlaceholder: "Introdu numele listei...",
      create: "Creează",
      welcomeMessage: "Bun venit! Creează o listă nouă pentru a începe.",
      noListSelected:
        "Te rog selectează o listă din istoric sau creează una nouă.",
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
      coffee: "Invítame a un café",
      createNewList: "Crear nueva lista",
      listName: "Nombre de la lista",
      listNamePlaceholder: "Ingresa el nombre de la lista...",
      create: "Crear",
      welcomeMessage: "¡Bienvenido! Crea una nueva lista para comenzar.",
      noListSelected:
        "Por favor selecciona una lista de tu historial o crea una nueva.",
    },
  };

  const [language, setLanguage] = useState("en");
  const t = translations[language];

  // Inside your component
  // useEffect(() => {
  //   const existing = document.getElementById("bmc-wjs");
  //   if (existing) return; // Prevent multiple injections

  //   const script = document.createElement("script");
  //   script.id = "bmc-wjs";
  //   script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
  //   script.setAttribute("data-name", "BMC-Widget");
  //   script.setAttribute("data-id", "radut");
  //   script.setAttribute("data-description", "Support me on Buy me a coffee!");
  //   script.setAttribute("data-message", "Buy me a coffee");
  //   script.setAttribute("data-color", "#5F7FFF");
  //   script.setAttribute("data-position", "Right");
  //   script.setAttribute("data-x_margin", "18");
  //   script.setAttribute("data-y_margin", "18");
  //   script.async = true;

  //   document.body.appendChild(script);

  //   return () => {
  //     const script = document.getElementById("bmc-wjs");
  //     if (script) script.remove();
  //   };
  // }, []);

  useEffect(() => {
    // Run diagnostic to check authentication setup
    checkAuthSetup();

    // Initialize authentication and handle any pending redirects
    const initializeAuthentication = async () => {
      try {
        const { user: redirectUser, error } = await initializeAuth();
        if (redirectUser) {
          console.log("Successfully authenticated via redirect:", redirectUser);
          setUser(redirectUser);
        } else if (error) {
          console.error("Authentication initialization error:", error);
        }
      } catch (error) {
        console.error("Error initializing authentication:", error);
      }
    };

    initializeAuthentication();

    // Listen to authentication state changes
    const unsubscribeAuth = onAuthStateChange((user) => {
      console.log("Auth state changed:", user ? user.email : "No user");
      setUser(user);

      // Reset list ownership when user changes
      if (!user) {
        setListBelongsToUser(false);
        setCurrentList(null);
        setItems([]);
        // Create a new anonymous list when user logs out
        createNewList()
          .then((newId) => {
            // Update the URL without triggering navigation
            window.history.replaceState(null, "", `/list/${newId}`);
          })
          .catch(console.error);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Redirect logged-in users to "new" route if they don't have access to the current list
  useEffect(() => {
    // Only redirect logged-in users who don't have access to the current list
    if (
      user &&
      id &&
      id !== "new" &&
      !listBelongsToUser &&
      currentList &&
      !justCreatedList
    ) {
      // Logged-in user doesn't have access to this list
      // Redirect to "new" route
      navigate("/list/new");
    }
  }, [user, id, listBelongsToUser, navigate, currentList, justCreatedList]);

  // Reset justCreatedList flag when user changes or when on "new" route
  useEffect(() => {
    if (!user || id === "new") {
      setJustCreatedList(false);
    }
  }, [user, id]);

  useEffect(() => {
    if (!id) return;

    if (id === "new") {
      // For logged-in users, just stay on the "new" route to show welcome state
      if (user) {
        setItems([]);
        setInput("");
        setQuantity("");
        setUnit("");
        setCurrentList(null);
        setListBelongsToUser(false);
        return;
      }
      // For non-logged-in users, create anonymous list
      createNewList().then((newId) => {
        navigate(`/list/${newId}`);
      });
      return;
    }

    let unsubscribe = () => {};

    try {
      unsubscribe = subscribeToList(id, (data) => {
        if (data) {
          setItems(data.items || []);
          setCurrentList(data);

          // Check if the list belongs to the current user
          if (user && data.userId) {
            const belongsToUser = data.userId === user.uid;
            setListBelongsToUser(belongsToUser);
          } else {
            setListBelongsToUser(false);
          }
        } else {
          setItems([]);
          setCurrentList(null);
          setListBelongsToUser(false);
        }
      });
    } catch (error) {
      console.error("Error setting up list subscription:", error);
      setItems([]);
      setCurrentList(null);
      setListBelongsToUser(false);
    }

    return () => {
      try {
        unsubscribe();
      } catch (error) {
        console.error("Error unsubscribing from list:", error);
      }
    };
  }, [id, navigate, user]);

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

  const handleNewList = () => {
    // For logged-in users, show the new list modal
    if (user) {
      setShowNewListModal(true);
      return;
    }
    // For non-logged-in users, create anonymous list
    createNewList().then((newId) => {
      navigate(`/list/${newId}`);
      setItems([]);
      setInput("");
    });
  };

  return (
    <div className="app">
      {/* Burger Menu Button */}
      <button
        className="burger-menu-button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Burger Menu Component */}
      <BurgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        language={language}
        onAccountClick={() => setShowAccount(true)}
        onHistoryClick={() => setShowListHistory(true)}
        user={user}
      />

      {/* Account Component */}
      {showAccount && (
        <Account onClose={() => setShowAccount(false)} language={language} />
      )}

      {/* List History Component */}
      {showListHistory && (
        <ListHistory
          onClose={() => setShowListHistory(false)}
          language={language}
          user={user}
        />
      )}

      {/* New List Modal */}
      {showNewListModal && (
        <NewListModal
          onClose={() => setShowNewListModal(false)}
          language={language}
          user={user}
          onListCreated={(newId) => {
            console.log("New list created with ID:", newId);
            setJustCreatedList(true);
            // Reset the flag after a short delay
            setTimeout(() => setJustCreatedList(false), 2000);
          }}
        />
      )}

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
        <h1 className={currentList?.name ? "custom-list-name" : ""}>
          {currentList?.name || t.title}
        </h1>

        {/* Show different content based on user state and list selection */}
        {user && id === "new" ? (
          // Logged in user on the "new" route - show welcome state
          <div className="welcome-state">
            <p className="welcome-message">{t.welcomeMessage}</p>
            <button
              className="create-list-button"
              onClick={() => setShowNewListModal(true)}
            >
              🆕 {t.createNewList}
            </button>
          </div>
        ) : (
          // User has a list selected or is not logged in
          <>
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
                  <div
                    className="item-content"
                    onClick={() => toggleItem(index)}
                  >
                    <input type="checkbox" checked={item.bought} readOnly />
                    <span>
                      {item.text}
                      {item.quantity > 1 || item.unit
                        ? ` — ${item.quantity}${
                            item.unit ? " " + item.unit : ""
                          }`
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
          </>
        )}
      </div>
    </div>
  );
}

export default App;
