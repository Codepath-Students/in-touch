// src/components/profile/ProfileDetails.jsx
import React, { useState } from "react";
import "./ProfileDetails.css";
import { PROFILE_LIMITS, applyLimit } from "../../utils/profileLimits";

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
              maxLength={PROFILE_LIMITS.username}
              help={`${(draft?.username || "").length}/${
                PROFILE_LIMITS.username
              }`}
              onChange={(e) =>
                onEditField?.(
                  "username",
                  applyLimit(e.target.value, PROFILE_LIMITS.username)
                )
              }
            />
            <DetailField
              label="Personality Type"
              value={draft?.personality_type || ""}
              maxLength={PROFILE_LIMITS.personality_type}
              help={`${(draft?.personality_type || "").length}/${
                PROFILE_LIMITS.personality_type
              }`}
              onChange={(e) =>
                onEditField?.(
                  "personality_type",
                  applyLimit(e.target.value, PROFILE_LIMITS.personality_type)
                )
              }
            />
            <DetailField
              label="Nearest City"
              value={draft?.nearest_city || ""}
              maxLength={PROFILE_LIMITS.nearest_city}
              help={`${(draft?.nearest_city || "").length}/${
                PROFILE_LIMITS.nearest_city
              }`}
              onChange={(e) =>
                onEditField?.(
                  "nearest_city",
                  applyLimit(e.target.value, PROFILE_LIMITS.nearest_city)
                )
              }
            />
            <DetailField
              label="Hobbies"
              value={draft?.hobbies || ""}
              maxLength={PROFILE_LIMITS.hobbies}
              help={`${(draft?.hobbies || "").length}/${
                PROFILE_LIMITS.hobbies
              }`}
              onChange={(e) =>
                onEditField?.(
                  "hobbies",
                  applyLimit(e.target.value, PROFILE_LIMITS.hobbies)
                )
              }
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

function DetailField({ label, value, onChange, maxLength, help }) {
  return (
    <div className="profile-detail-item">
      <span className="profile-detail-label">{label}</span>
      <input
        className="profile-detail-input"
        value={value}
        maxLength={maxLength}
        onChange={onChange}
      />
      {help ? (
        <span
          className="profile-detail-help"
          style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}
        >
          {help}
        </span>
      ) : null}
    </div>
  );
}
