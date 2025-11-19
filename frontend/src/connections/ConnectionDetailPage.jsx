// src/pages/ConnectionDetailPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./components/ConnectionDetailModal.css";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const computeDaysUntilReachout = (connection) => {
  const reminderFreq =
    connection.reminder_frequency_days ??
    connection.reminderFrequency;

  if (!reminderFreq || reminderFreq <= 0) return null;

  const lastContactedRaw =
    connection.last_contacted_at ??
    connection.lastContactedAt ??
    connection.created_at ??
    connection.createdAt;

  if (!lastContactedRaw) return null;

  const lastContacted = new Date(lastContactedRaw);
  if (Number.isNaN(lastContacted.getTime())) return null;

  const now = new Date();
  const daysSinceLast =
    (now.getTime() - lastContacted.getTime()) / MS_PER_DAY;

  // Positive when time remains; zero/negative when due/overdue
  return Math.round(reminderFreq - daysSinceLast);
};

const formatReachoutLabel = (daysUntilReachout) => {
  if (daysUntilReachout == null) return "Not computed";
  if (daysUntilReachout <= 0) return "Now";
  if (daysUntilReachout === 1) return "In 1 day";
  return `In ${daysUntilReachout} days`;
};

const formatConnectionType = (connectionType) => {
  if (!connectionType) return "Connection";
  return connectionType.replace(/_/g, " ");
};

const ConnectionDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // We expect the parent to pass connection via location.state
  const connection = location.state?.connection;

  if (!connection) {
    return (
      <div className="connection-detail-page">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/connections")}
        >
          ← Back to connections
        </button>
        <p>Connection not found. Try going back to the connections list.</p>
      </div>
    );
  }

  const name =
    connection.connection_name ??
    connection.name ??
    "Unknown";

  const connectionTypeRaw =
    connection.connection_type ??
    connection.connectionType ??
    "";

  const reminderFrequency =
    connection.reminder_frequency_days ??
    connection.reminderFrequency ??
    null;

  const reachOutPriority =
    connection.reach_out_priority ??
    connection.reachOutPriority ??
    0;

  const createdAt =
    connection.created_at ??
    connection.createdAt ??
    null;

  const lastContactedAt =
    connection.last_contacted_at ??
    connection.lastContactedAt ??
    null;

  const notes = connection.notes || "";

  const daysUntilReachout = computeDaysUntilReachout(connection);

  return (
    <div className="connection-detail-page">
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate("/connections")}
      >
        ← Back to connections
      </button>

      {/* Reuse the old "modal" styling as the main card on the page */}
      <div className="connection-detail-modal">
        <h2>{name}</h2>
        <p className="connection-detail-subtitle">
          {formatConnectionType(connectionTypeRaw)}
        </p>

        <div className="connection-detail-grid">
          <div className="connection-detail-item">
            <span className="label">Reminder frequency</span>
            <span className="value">
              {reminderFrequency != null
                ? `${reminderFrequency} days`
                : "Not set"}
            </span>
          </div>

          <div className="connection-detail-item">
            <span className="label">Reach out</span>
            <span className="value">
              {formatReachoutLabel(daysUntilReachout)}
            </span>
          </div>

          <div className="connection-detail-item">
            <span className="label">Priority</span>
            <span className="value">{reachOutPriority}</span>
          </div>

          {createdAt && (
            <div className="connection-detail-item">
              <span className="label">Created</span>
              <span className="value">
                {new Date(createdAt).toLocaleString()}
              </span>
            </div>
          )}

          {lastContactedAt && (
            <div className="connection-detail-item">
              <span className="label">Last contacted</span>
              <span className="value">
                {new Date(lastContactedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {notes && (
          <div className="connection-detail-notes card">
            <div className="label">Notes</div>
            <div className="value">{notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionDetailPage;
