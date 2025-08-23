import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewList } from "../lib/firestore";
import "./NewListModal.css";

function NewListModal({ onClose, language, user, onListCreated }) {
  const [listName, setListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const translations = {
    en: {
      createNewList: "Create New List",
      listName: "List Name",
      listNamePlaceholder: "Enter list name...",
      create: "Create",
      cancel: "Cancel",
      loading: "Creating...",
      error: "Please enter a list name",
    },
    ro: {
      createNewList: "Creează listă nouă",
      listName: "Numele listei",
      listNamePlaceholder: "Introdu numele listei...",
      create: "Creează",
      cancel: "Anulează",
      loading: "Se creează...",
      error: "Te rog introdu numele listei",
    },
    es: {
      createNewList: "Crear nueva lista",
      listName: "Nombre de la lista",
      listNamePlaceholder: "Ingresa el nombre de la lista...",
      create: "Crear",
      cancel: "Cancelar",
      loading: "Creando...",
      error: "Por favor ingresa el nombre de la lista",
    },
  };

  const t = translations[language];

  const handleCreateList = async (e) => {
    e.preventDefault();

    if (!listName.trim()) {
      setError(t.error);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userId = user?.uid;
      const userName = user?.email;
      const newId = await createNewList(userId, userName, listName.trim());
      onClose();
      // Notify parent that a list was created
      if (onListCreated) {
        onListCreated(newId);
      }
      // Small delay to ensure modal closes before navigation
      setTimeout(() => {
        navigate(`/list/${newId}`);
      }, 50);
    } catch (error) {
      console.error("Error creating list:", error);
      setError("Failed to create list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    navigate("/");
  };

  return (
    <div className="new-list-modal">
      <div className="new-list-content">
        <div className="new-list-header">
          <h2>{t.createNewList}</h2>
          <button className="close-button" onClick={handleCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateList} className="new-list-form">
          <div className="form-group">
            <label htmlFor="listName">{t.listName}</label>
            <input
              type="text"
              id="listName"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder={t.listNamePlaceholder}
              required
              disabled={loading}
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
              disabled={loading}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="create-button"
              disabled={loading || !listName.trim()}
            >
              {loading ? t.loading : t.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewListModal;
