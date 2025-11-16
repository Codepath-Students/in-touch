// src/components/connections/ConnectionsHeader.jsx
import React from "react";
import "./ConnectionHeader.css";

const ConnectionsHeader = ({ search, onSearchChange, onAddClick, loading, saving }) => {
  const handleInputChange = (e) => {
    onSearchChange(e);
  };

  return (
    <header className="connections-header">
      <div className="connections-header-main">
        <div>
          <h1 className="connections-title">Connections</h1>
          <p className="connections-subtitle">
            Prioritized list of who to reach out to next.
          </p>
        </div>
      </div>

      <div className="connections-header-actions">
        <div className="connections-search-wrapper">
          <input
            type="text"
            value={search}
            onChange={handleInputChange}
            placeholder="Search connections..."
            className="connections-search-input"
          />
        </div>

        <button
          type="button"
          className="btn btn-primary connections-add-btn"
          onClick={onAddClick}
        >
          + Add Connection
        </button>
      </div>

      {(loading || saving) && (
        <div className="connections-status-pill">
          {loading ? "Loading connections..." : "Saving changes..."}
        </div>
      )}
    </header>
  );
};

export default ConnectionsHeader;
