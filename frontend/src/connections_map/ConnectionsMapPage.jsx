// src/ConnectionsMapPage.jsx (or wherever it lives)
import React, { useEffect, useState } from "react";
import "./ConnectionsMapPage.css";

import ConnectionsMap from "./components/ConnectionsMap";
import ConnectionsMapLine from "./components/ConnectionMapLine";
import ConnectionContactModal from "./components/ConnectionContactModal";

import {
  fetchConnections,
  markReachedOut,
} from "../connections/services/ConnectionBackendService";

// THRESHOLDS for “closeness” logic (can be tuned)
const RECENT_DAYS = 14; // <= 14 days → close + green
const STALE_DAYS = 45; // >= 45 days → far + red

const ConnectionsMapPage = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [contactModalConnection, setContactModalConnection] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchConnections();
      setConnections(res || []);
      console.log(res);
    } catch (err) {
      setError(err.message || "Something went wrong loading connections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNodeClick = (connection) => {
    setContactModalConnection(connection);
  };

  const handleContactModalClose = () => {
    setContactModalConnection(null);
  };

  const handleConfirmContacted = async () => {
    if (!contactModalConnection) return;
    setSaving(true);
    setError(null);
    try {
      // 🔑 Use id from DB, not connectionId
      await markReachedOut(contactModalConnection.id);
      await loadData();
      setContactModalConnection(null);
    } catch (err) {
      setError(err.message || "Failed to update contact status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="connections-map-page app-shell">
      <div className="connections-map-page-inner">
        <h1>Your Connections Map</h1>

        {error && (
          <div className="connections-map-error card">
            <div className="connections-map-error-header">
              Something went wrong
            </div>
            <div className="connections-map-error-body">{error}</div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={loadData}
            >
              Retry
            </button>
          </div>
        )}

        <ConnectionsMapLine
          connections={connections}
          loading={loading}
          recentDays={RECENT_DAYS}
          staleDays={STALE_DAYS}
          onNodeClick={handleNodeClick}
        />

        {contactModalConnection && (
          <ConnectionContactModal
            connection={contactModalConnection}
            onClose={handleContactModalClose}
            onConfirm={handleConfirmContacted}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
};

export default ConnectionsMapPage;
