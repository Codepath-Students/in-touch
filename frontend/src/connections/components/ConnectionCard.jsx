// src/components/connections/ConnectionCard.jsx
import React from "react";
import "./ConnectionCard.css";

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

  // Positive when we still have time, negative/zero when due/overdue
  const daysUntil = Math.round(reminderFreq - daysSinceLast);
  return daysUntil;
};

const formatReachoutLabel = (daysUntilReachout) => {
  if (daysUntilReachout == null) return "Reach out soon";
  if (daysUntilReachout <= 0) return "Reach out now";
  if (daysUntilReachout === 1) return "Reach out in 1 day";
  return `Reach out in ${daysUntilReachout} days`;
};

const formatConnectionType = (connectionType) => {
  if (!connectionType) return "Not set";
  return connectionType.replace(/_/g, " "); // "close_friend" → "close friend"
};

const ConnectionCard = ({
  connection,
  onDelete,
  onReachedOut,
  onOpenDetail,
  onEdit,
}) => {
  // Normalized fields from DB (with backward-compat for old shape)
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

  const daysUntilReachout = computeDaysUntilReachout(connection);
  const isDueNow =
    daysUntilReachout != null && daysUntilReachout <= 0;

  return (
    <article className="connection-card">
      <div className="connection-card-main">
        <div className="connection-card-name-row">
          <div className="connection-card-avatar">
            {name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <h3 className="connection-card-name">{name}</h3>
            {/* <p className="connection-card-title">
              {formatConnectionType(connectionTypeRaw)}
            </p> */}
          </div>
        </div>

        <div className="connection-card-meta">
          <span
            className={
              "connection-card-reachout-tag" +
              (isDueNow ? " connection-card-reachout-now" : "")
            }
          >
            {formatReachoutLabel(daysUntilReachout)}
          </span>
          <span className="connection-card-submeta">
            Every{" "}
            {reminderFrequency != null
              ? `${reminderFrequency} days`
              : "—"}
            {" • "}
            Priority {reachOutPriority}
          </span>
        </div>
      </div>

      <div className="connection-card-actions">
        <button
          type="button"
          className="btn btn-primary connection-card-btn"
          onClick={onReachedOut}
        >
          Reached Out
        </button>
        <button
          type="button"
          className="btn btn-ghost connection-card-btn"
          onClick={() => onOpenDetail(connection)}
        >
          Details
        </button>
        <button
          type="button"
          className="btn btn-ghost connection-card-btn"
          onClick={() => onEdit(connection)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-ghost connection-card-btn connection-card-delete"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default ConnectionCard;
