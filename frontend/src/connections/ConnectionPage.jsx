// src/ConnectionPage.jsx
import React, { useEffect, useState } from "react";
import "./ConnectionPage.css";
import {
  fetchConnections,
  addConnection,
  updateConnection,
  deleteConnection,
  markReachedOut,
} from "./services/ConnectionBackendService";

import ConnectionsHeader from "./components/ConnectionHeader";
import ConnectionsGrid from "./components/ConnectionGrid";
import ConnectionFormModal from "./components/ConnectionFormModal";
import { useNavigate } from "react-router-dom";
// If you want the same error UI as profile:
// import ErrorBox from "../components/ErrorBox";

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // start true, like ProfilePage
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(""); // string instead of null

  const [editingConnection, setEditingConnection] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const navigate = useNavigate();

  // Centralized loader, similar to loadProfile()
  const loadData = async () => {
    setLoading(true);
    setError("");

    // Fast-fail: no token
    try {
      const hasToken = Boolean(window?.localStorage?.getItem("access_token"));
      if (!hasToken) {
        setError("You must be logged in to view this page.");
        setLoading(false);
        return;
      }
    } catch {
      // ignore token read errors, still try request
    }

    try {
      const res = await fetchConnections();
      setConnections(res || []);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setError("You must be logged in to view this page.");
      } else {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong loading connections."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleAddClick = () => {
    setEditingConnection(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (connection) => {
    setEditingConnection(connection);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingConnection(null);
  };

  const handleFormSubmit = async (data) => {
    setSaving(true);
    setError("");
    try {
      if (editingConnection) {
        await updateConnection(editingConnection.id, data);
      } else {
        await addConnection(data);
      }
      await loadData();
      handleFormClose();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to save connection."
      );
    } finally {
      setSaving(false);
    }
  };

 const handleDelete = async (connection) => {
  setSaving(true);
  setError("");

  try {
    await deleteConnection(connection.id); // backend expects connection.id
    await loadData();
  } catch (err) {
    setError(
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Failed to delete connection."
    );
  } finally {
    setSaving(false);
  }
};


  const handleReachedOut = async (connection) => {
    setSaving(true);
    setError("");
    try {
      await markReachedOut(connection.id);
      console.log("connectionID:", connection.id);
      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to mark as reached out."
      );
    } finally {
      setSaving(false);
    }
  };

  // ✅ Route to dynamic details page instead of opening modal
  const handleOpenDetail = (connection) => {
    navigate(`/connections/${connection.id}`, {
      state: { connection },
    });
  };

  // Filter connections based on search (case-insensitive, on name and email)
  const filteredConnections = connections.filter((c) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="connections-page">
      <div className="connections-page-inner">
        <header className="connections-page-header">
          <h1 className="connections-page-title">Connections</h1>
          <p className="connections-page-subtitle">
            View and manage all your connections here.
          </p>
        </header>

        {/* If you want to use ErrorBox like ProfilePage, swap this block */}
        {error && (
          <div className="connections-error card">
            <div className="connections-error-header">Something went wrong</div>
            <div className="connections-error-body">{error}</div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                if (error.includes("logged in")) {
                  navigate("/"); // or /login if you have it
                } else {
                  loadData();
                }
              }}
            >
              {error.includes("logged in") ? "Go home" : "Retry"}
            </button>
          </div>
        )}

        {!error && (
          <>
            <ConnectionsHeader
              search={search}
              onSearchChange={handleSearchChange}
              onAddClick={handleAddClick}
              loading={loading}
              saving={saving}
            />

            <ConnectionsGrid
              connections={connections}
              loading={loading}
              onDelete={handleDelete}
              onReachedOut={handleReachedOut}
              onOpenDetail={handleOpenDetail}
              onEdit={handleEditClick}
            />

            {isFormOpen && (
              <ConnectionFormModal
                connection={editingConnection}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                saving={saving}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
