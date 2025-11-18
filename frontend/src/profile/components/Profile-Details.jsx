// src/components/profile/ProfileDetails.jsx
import React, { useState } from "react";
import "./ProfileDetails.css";

export default function ProfileDetails({
  profile,
  draft,
  loading,
  saving,
  onEditField,
  onSave,
}) {
  const [editMode, setEditMode] = useState(false);

  // Read-only meta
  const email = profile?.email || "";
  const created_at = profile?.created_at || null;
  // Removed last_login_at and email verification from UI per request

  if (loading || !profile) {
    return (
      <section className="profile-details-card">
        <p className="profile-details-loading">Loading profile details…</p>
      </section>
    );
  }

  const handleSaveClick = () => {
    onSave?.();
    setEditMode(false);
  };

  const formatDate = (value) => {
    try {
      if (!value) return "—";
      const d = new Date(value);
      return d.toLocaleString();
    } catch {
      return String(value);
    }
  };

  return (
    <section className="profile-details-card">
      <div className="profile-details-header-row">
        <h3 className="profile-details-heading">Account & profile details</h3>

        <div className="profile-details-header-right">
          <div className="profile-details-status">
            <span className="profile-details-status-dot" />
            <span className="profile-details-status-text">Online</span>
          </div>

          <button
            type="button"
            className="profile-details-edit-button"
            onClick={() => setEditMode((prev) => !prev)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {editMode ? (
        <>
          <div className="profile-details-grid">
            <DetailField
              label="Display Name"
              value={draft?.display_name || ""}
              onChange={(e) => onEditField?.("display_name", e.target.value)}
            />
            <DetailField
              label="Username"
              value={draft?.username || ""}
              onChange={(e) => onEditField?.("username", e.target.value)}
            />
            <DetailField
              label="Personality Type"
              value={draft?.personality_type || ""}
              onChange={(e) =>
                onEditField?.("personality_type", e.target.value)
              }
            />
            <DetailField
              label="Nearest City"
              value={draft?.nearest_city || ""}
              onChange={(e) => onEditField?.("nearest_city", e.target.value)}
            />
            <DetailField
              label="Hobbies"
              value={draft?.hobbies || ""}
              onChange={(e) => onEditField?.("hobbies", e.target.value)}
            />
          </div>

          <div className="profile-details-actions">
            <button
              type="button"
              className="profile-details-save-button"
              onClick={handleSaveClick}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </>
      ) : (
        <div className="profile-details-grid">
          <DetailItem label="Email" value={email} />
          <DetailItem label="Username" value={profile.username} />
          <DetailItem label="Display Name" value={profile.display_name} />
          <DetailItem
            label="Personality Type"
            value={profile.personality_type}
          />
          <DetailItem label="Nearest City" value={profile.nearest_city} />
          <DetailItem label="Hobbies" value={profile.hobbies} />
          <DetailItem label="Member Since" value={formatDate(created_at)} />
        </div>
      )}
    </section>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="profile-detail-item">
      <span className="profile-detail-label">{label}</span>
      <span className="profile-detail-value">{value || "—"}</span>
    </div>
  );
}

function DetailField({ label, value, onChange }) {
  return (
    <div className="profile-detail-item">
      <span className="profile-detail-label">{label}</span>
      <input
        className="profile-detail-input"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
