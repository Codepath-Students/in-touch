// src/pages/ConnectionDetailPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./components/ConnectionDetailModal.css";

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
        <h2>{connection.name}</h2>
        <p className="connection-detail-subtitle">
          {connection.connectionType
            ? connection.connectionType.replace("_", " ")
            : "Connection"}
        </p>

        <div className="connection-detail-grid">
          <div className="connection-detail-item">
            <span className="label">Status</span>
            <span className="value">{connection.status}</span>
          </div>

          <div className="connection-detail-item">
            <span className="label">Reminder frequency</span>
            <span className="value">
              {connection.reminderFrequency != null
                ? `${connection.reminderFrequency} days`
                : "Not set"}
            </span>
          </div>

          <div className="connection-detail-item">
            <span className="label">Reachout in</span>
            <span className="value">
              {connection.daysUntilReachout != null
                ? `${connection.daysUntilReachout} days`
                : "Not computed"}
            </span>
          </div>

          {connection.createdAt && (
            <div className="connection-detail-item">
              <span className="label">Created</span>
              <span className="value">
                {new Date(connection.createdAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {connection.notes && (
          <div className="connection-detail-notes card">
            <div className="label">Notes</div>
            <div className="value">{connection.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionDetailPage;
