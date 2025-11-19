// src/components/connections/ConnectionFormModal.jsx
import React, { useEffect, useState } from "react";
import "./ConnectionFormModal.css";

// Valid values (aligned with ERD constraints / backend)
const CONNECTION_TYPES = [
  { value: "", label: "Not set" },
  { value: "close_friend", label: "Close friend" },
  { value: "family_member", label: "Family member" },
  { value: "friend", label: "Friend" },
  { value: "acquaintance", label: "Acquaintance" },
];

const ConnectionFormModal = ({ connection, onClose, onSubmit, saving }) => {
  const isEdit = Boolean(connection);

  const [name, setName] = useState("");
  const [connectionType, setConnectionType] = useState("");
  const [reminderFrequency, setReminderFrequency] = useState("");
  const [priority, setPriority] = useState(""); // reach_out_priority 0..10
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (connection) {
      // Be defensive: support both old FE shape and new BE shape
      setName(
        connection.connection_name ??
          connection.name ??
          ""
      );
      setConnectionType(
        connection.connection_type ??
          connection.connectionType ??
          ""
      );
      setReminderFrequency(
        connection.reminder_frequency_days != null
          ? String(connection.reminder_frequency_days)
          : connection.reminderFrequency != null
          ? String(connection.reminderFrequency)
          : ""
      );
      setPriority(
        connection.reach_out_priority != null
          ? String(connection.reach_out_priority)
          : connection.reachOutPriority != null
          ? String(connection.reachOutPriority)
          : ""
      );
      setNotes(connection.notes || "");
    } else {
      setName("");
      setConnectionType("");
      setReminderFrequency("");
      setPriority("");
      setNotes("");
    }
  }, [connection]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedNotes = notes.trim();

    // Frontend guards to avoid obvious 400s
    if (!trimmedName) {
      alert("Name is required");
      return;
    }
    if (!reminderFrequency) {
      alert("Reminder frequency (days) is required");
      return;
    }

    const freqNum = Number(reminderFrequency);
    const priorityNum =
      priority === "" ? null : Number(priority);

    const payload = {
      // 🔥 Match backend expectations exactly
      connection_name: trimmedName,
      connection_type: connectionType || "acquaintance", // backend expects string; default if blank
      reminder_frequency_days: freqNum,
      notes: trimmedNotes,
      know_from: "", // optional; backend COALESCEs to '' in INSERT
      reach_out_priority:
        priorityNum == null || Number.isNaN(priorityNum)
          ? 0
          : priorityNum,
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="connection-form-modal">
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h2>{isEdit ? "Edit connection" : "Add connection"}</h2>
        <p className="connection-form-subtitle">
          Track how often you want to reach out to this person.
        </p>

        <form className="connection-form" onSubmit={handleSubmit}>
          <div className="connection-form-field">
            <label htmlFor="connection-name">Name</label>
            <input
              id="connection-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div className="connection-form-field">
            <label htmlFor="connection-type">Connection type</label>
            <select
              id="connection-type"
              value={connectionType}
              onChange={(e) => setConnectionType(e.target.value)}
            >
              {CONNECTION_TYPES.map((ct) => (
                <option key={ct.value || "none"} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>

          <div className="connection-form-field">
            <label htmlFor="connection-reminder">
              Reminder frequency (days)
              <span className="helper">
                How often you’d like to be reminded to reach out.
              </span>
            </label>
            <input
              id="connection-reminder"
              type="number"
              min="1"
              required
              value={reminderFrequency}
              onChange={(e) => setReminderFrequency(e.target.value)}
              placeholder="e.g. 30"
            />
          </div>

          <div className="connection-form-field">
            <label htmlFor="connection-priority">
              Reach out priority (0–10)
              <span className="helper">
                Higher means more important to keep in touch.
              </span>
            </label>
            <input
              id="connection-priority"
              type="number"
              min="0"
              max="10"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>

          <div className="connection-form-field">
            <label htmlFor="connection-notes">Notes</label>
            <textarea
              id="connection-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Context, how you met, follow ups..."
              rows={4}
            />
          </div>

          <div className="connection-form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : isEdit ? "Save changes" : "Add connection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionFormModal;
