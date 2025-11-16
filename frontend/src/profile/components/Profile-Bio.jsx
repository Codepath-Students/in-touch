// src/components/profile/ProfileBio.jsx
import React, { useEffect, useState } from "react";
import "./ProfileBio.css";

export default function ProfileBio({ profile, loading, saving, onSaveBio }) {
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (profile && !editMode) {
      setDraft(profile.bio || "");
    }
  }, [profile, editMode]);

  const handleSaveClick = () => {
    if (!profile) return;
    onSaveBio(draft);
    setEditMode(false);
  };

  if (loading || !profile) {
    return (
      <section className="profile-bio-card">
        <p className="profile-bio-loading">Loading description…</p>
      </section>
    );
  }

  return (
    <section className="profile-bio-card">
      <div className="profile-bio-header">
        <h3 className="profile-bio-heading">Profile description</h3>
        <button
          type="button"
          className="profile-bio-edit-button"
          onClick={() => setEditMode((prev) => !prev)}
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      {editMode ? (
        <>
          <textarea
            className="profile-bio-textarea"
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="profile-bio-actions">
            <button
              type="button"
              className="profile-bio-save-button"
              onClick={handleSaveClick}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </>
      ) : (
        <p className="profile-bio-text">{profile.bio}</p>
      )}
    </section>
  );
}
