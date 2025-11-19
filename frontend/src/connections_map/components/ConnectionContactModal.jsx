// src/components/connections/ConnectionContactModal.jsx
import React from "react";
import "./ConnectionContactModal.css";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getDisplayName = (connection) =>
  connection.connection_name ?? connection.name ?? "Unknown";

const getConnectionTypeLabel = (connection) => {
  const raw =
    connection.connection_type ??
    connection.connectionType ??
    "";
  return raw ? raw.replace(/_/g, " ") : null;
};

const getDaysSinceLastContact = (connection) => {
  const lastContactedRaw =
    connection.last_contacted_at ??
    connection.lastContactedAt ??
    connection.created_at ??
    connection.createdAt;

  if (!lastContactedRaw) return null;

  const lastDate = new Date(lastContactedRaw);
  if (Number.isNaN(lastDate.getTime())) return null;

  const today = new Date();
  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = today - lastDate;
  return Math.floor(diffMs / MS_PER_DAY);
};

const ConnectionContactModal = ({ connection, onClose, onConfirm, saving }) => {
  if (!connection) return null;

  const name = getDisplayName(connection);
  const typeLabel = getConnectionTypeLabel(connection);
  const daysSinceLast = getDaysSinceLastContact(connection);

  return (
    <div className="modal-overlay">
      <div className="connection-contact-modal">
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h2>Did you reach out to {name}?</h2>
        <p className="connection-contact-subtitle">
          Updating this will move them closer to you on the map and reset their
          reminder.
        </p>

        <div className="connection-contact-body card">
          <div className="connection-contact-name">{name}</div>
          <div className="connection-contact-meta">
            {typeLabel && <span>{typeLabel}</span>}
            {daysSinceLast != null && (
              <span>Last contacted {daysSinceLast} days ago</span>
            )}
          </div>
        </div>

        <div className="connection-contact-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={saving}
          >
            Not yet
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={saving}
          >
            {saving ? "Updating..." : "Yes, I reached out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionContactModal;
