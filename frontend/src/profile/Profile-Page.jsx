// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "./services/Profile-Service";

import ProfileBio from "./components/Profile-Bio";
import ProfileDetails from "./components/Profile-Details";
import ProfileHeader from "./components/Profile-Header";

import "./ProfilePage.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Centralized, frontend-only draft for editable fields
  const [profileDraft, setProfileDraft] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
        setProfileDraft({
          display_name: data.display_name || "",
          username: data.username || "",
          bio: data.bio || "",
          personality_type: data.personality_type || "",
          nearest_city: data.nearest_city || "",
          hobbies: data.hobbies || "",
          profile_picture_url: data.profile_picture_url || "",
        });
      } catch (err) {
        setError(err.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Single update method for any profile changes
  const handleUpdateProfile = async (patch) => {
    if (!profile) return;
    try {
      setSaving(true);
      const updated = await updateProfile(profile.id, patch);
      setProfile(updated);
      // keep draft in sync post-save
      setProfileDraft((prev) => ({
        ...(prev || {}),
        ...patch,
      }));
    } catch (err) {
      setError(err.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  // Field editor to mutate centralized draft state
  const editProfileField = (field, value) => {
    setProfileDraft((prev) => ({ ...(prev || {}), [field]: value }));
  };

  // Save helpers for child components
  const saveDetailsFromDraft = () => {
    if (!profileDraft) return;
    const patch = {
      display_name: profileDraft.display_name,
      username: profileDraft.username,
      personality_type: profileDraft.personality_type,
      nearest_city: profileDraft.nearest_city,
      hobbies: profileDraft.hobbies,
    };
    return handleUpdateProfile(patch);
  };

  const saveBioFromDraft = () => {
    if (!profileDraft) return;
    return handleUpdateProfile({ bio: profileDraft.bio });
  };

  return (
    <div className="profile-page">
      <header className="profile-page-header">
        <h1 className="profile-page-title">Profile</h1>
        <p className="profile-page-subtitle">
          View all your profile details here.
        </p>
      </header>

      {error && <div className="profile-page-error">{error}</div>}

      <div className="profile-page-grid">
        <ProfileHeader profile={profile} loading={loading} />
        <ProfileDetails
          profile={profile}
          draft={profileDraft}
          loading={loading}
          saving={saving}
          onEditField={editProfileField}
          onSave={saveDetailsFromDraft}
        />
      </div>

      <ProfileBio
        profile={profile}
        bioValue={profileDraft?.bio || ""}
        onEditField={editProfileField}
        loading={loading}
        saving={saving}
        onSave={saveBioFromDraft}
      />
    </div>
  );
}
