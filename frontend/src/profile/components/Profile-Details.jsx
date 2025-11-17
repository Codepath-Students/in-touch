// src/components/profile/ProfileDetails.jsx
import React, { useEffect, useState } from "react";
import "./ProfileDetails.css";

export default function ProfileDetails({
  profile,
  loading,
  saving,
  onSaveDetails
}) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    role: "",
    experienceLevel: "",
    city: "",
    availability: ""
  });

  // Keep local form in sync with profile when not editing
  useEffect(() => {
    if (profile && !editMode) {
      setForm({
        firstname: profile.firstname || "",
        lastname: profile.lastname || "",
        role: profile.role || "",
        experienceLevel: profile.experienceLevel || "",
        city: profile.city || "",
        availability: profile.availability || ""
      });
    }
  }, [profile, editMode]);

  if (loading || !profile) {
    return (
      <section className="profile-details-card">
        <p className="profile-details-loading">Loading profile details…</p>
      </section>
    );
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveClick = () => {
    onSaveDetails(form);
    setEditMode(false);
  };

  return (
    <section className="profile-details-card">
      <div className="profile-details-header-row">
        <h3 className="profile-details-heading">Bio &amp; other details</h3>

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
              label="First Name"
              value={form.firstname}
              onChange={handleChange("firstname")}
            />
            <DetailField
              label="Last Name"
              value={form.lastname}
              onChange={handleChange("lastname")}
            />
            <DetailField
              label="My Role"
              value={form.role}
              onChange={handleChange("role")}
            />
            <DetailField
              label="Experience Level"
              value={form.experienceLevel}
              onChange={handleChange("experienceLevel")}
            />
            <DetailField
              label="City / Region"
              value={form.city}
              onChange={handleChange("city")}
            />
            <DetailField
              label="Availability"
              value={form.availability}
              onChange={handleChange("availability")}
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
          <DetailItem label="First Name" value={profile.firstname} />
          <DetailItem label="Last Name" value={profile.lastname} />
          <DetailItem label="My Role" value={profile.role} />
          <DetailItem
            label="Experience Level"
            value={profile.experienceLevel}
          />
          <DetailItem label="City / Region" value={profile.city} />
          <DetailItem label="Availability" value={profile.availability} />
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
