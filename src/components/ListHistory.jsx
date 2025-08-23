import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeToUserListsSimple } from "../lib/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import "./ListHistory.css";

function ListHistory({ onClose, language, user }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const subscriptionRef = useRef(null);

  const translations = {
    en: {
      listHistory: "List History",
      myLists: "My Lists",
      noLists: "You haven't created any lists yet.",
      createFirstList: "Create your first list!",
      newList: "New List",
      view: "View",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete this list?",
      yes: "Yes",
      no: "No",
      close: "Close",
      loading: "Loading...",
      items: "items",
      item: "item",
      created: "Created",
      lastModified: "Last modified",
      empty: "Empty list",
      error: "Error loading lists",
    },
    ro: {
      listHistory: "Istoric liste",
      myLists: "Listele mele",
      noLists: "Nu ai creat încă nicio listă.",
      createFirstList: "Creează prima ta listă!",
      newList: "Listă nouă",
      view: "Vezi",
      delete: "Șterge",
      deleteConfirm: "Ești sigur că vrei să ștergi această listă?",
      yes: "Da",
      no: "Nu",
      close: "Închide",
      loading: "Se încarcă...",
      items: "produse",
      item: "produs",
      created: "Creată",
      lastModified: "Ultima modificare",
      empty: "Listă goală",
      error: "Eroare la încărcarea listelor",
    },
    es: {
      listHistory: "Historial de listas",
      myLists: "Mis listas",
      noLists: "Aún no has creado ninguna lista.",
      createFirstList: "¡Crea tu primera lista!",
      newList: "Lista nueva",
      view: "Ver",
      delete: "Eliminar",
      deleteConfirm: "¿Estás seguro de que quieres eliminar esta lista?",
      yes: "Sí",
      no: "No",
      close: "Cerrar",
      loading: "Cargando...",
      items: "productos",
      item: "producto",
      created: "Creada",
      lastModified: "Última modificación",
      empty: "Lista vacía",
      error: "Error al cargar las listas",
    },
  };

  const t = translations[language];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Clean up previous subscription
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current();
      } catch (error) {
        console.error("Error cleaning up previous subscription:", error);
      }
      subscriptionRef.current = null;
    }

    let unsubscribe = () => {};

    try {
      unsubscribe = subscribeToUserListsSimple(user.uid, (userLists) => {
        setLists(userLists);
        setLoading(false);
        setError("");
      });
      subscriptionRef.current = unsubscribe;
    } catch (error) {
      console.error("Error setting up subscription:", error);
      setError("Failed to load lists");
      setLoading(false);
    }

    return () => {
      try {
        if (subscriptionRef.current) {
          subscriptionRef.current();
          subscriptionRef.current = null;
        }
      } catch (error) {
        console.error("Error unsubscribing:", error);
      }
    };
  }, [user]);

  const handleViewList = (listId) => {
    navigate(`/list/${listId}`);
    onClose();
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm(t.deleteConfirm)) {
      return;
    }

    try {
      setError("");
      await deleteDoc(doc(db, "shopping-lists", listId));
      // The list will be automatically removed from the state via the subscription
    } catch (error) {
      console.error("Error deleting list:", error);
      setError("Failed to delete list. Please try again.");
    }
  };

  const handleNewList = () => {
    navigate("/list/new");
    onClose();
  };

  const formatDate = (date) => {
    if (!date) return "";

    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString(
      language === "en" ? "en-US" : language === "ro" ? "ro-RO" : "es-ES",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getItemCount = (items) => {
    if (!items || items.length === 0) return t.empty;
    const count = items.length;
    return `${count} ${count === 1 ? t.item : t.items}`;
  };

  if (!user) {
    return (
      <div className="list-history-modal">
        <div className="list-history-content">
          <div className="list-history-header">
            <h2>{t.listHistory}</h2>
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="list-history-body">
            <p>Please sign in to view your list history.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="list-history-modal">
      <div className="list-history-content">
        <div className="list-history-header">
          <h2>{t.myLists}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="list-history-body">
          {loading ? (
            <div className="loading">{t.loading}</div>
          ) : error ? (
            <div className="error-message">{t.error}</div>
          ) : lists.length === 0 ? (
            <div className="empty-state">
              <p>{t.noLists}</p>
              <button className="new-list-button" onClick={handleNewList}>
                {t.createFirstList}
              </button>
            </div>
          ) : (
            <>
              <div className="lists-header">
                <button className="new-list-button" onClick={handleNewList}>
                  🆕 {t.newList}
                </button>
              </div>

              <div className="lists-container">
                {lists.map((list) => (
                  <div key={list.id} className="list-item">
                    <div className="list-info">
                      <div className="list-header">
                        <h3>{list.name || `List ${list.id.slice(-6)}`}</h3>
                        <span className="item-count">
                          {getItemCount(list.items)}
                        </span>
                      </div>

                      <div className="list-dates">
                        <p className="created-date">
                          {t.created}: {formatDate(list.createdAt)}
                        </p>
                        {list.updatedAt && (
                          <p className="updated-date">
                            {t.lastModified}: {formatDate(list.updatedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="list-actions">
                      <button
                        className="view-button"
                        onClick={() => handleViewList(list.id)}
                      >
                        👁️ {t.view}
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteList(list.id, list.name)}
                      >
                        🗑️ {t.delete}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListHistory;
