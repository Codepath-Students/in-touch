// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { getProfile, updateProfileBio, updateProfileDetails } from "./services/Profile-Service";

import ProfileBio from "./components/Profile-Bio";
import ProfileDetails from "./components/Profile-Details";
import ProfileHeader from "./components/Profile-Header";   

import "./ProfilePage.css"

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingBio, setSavingBio] = useState(false);
  const [error, setError] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);

  useEffect(() => {
    async function loadProfile() {
        try {
        const data = await getProfile();
        setProfile(data);
        } catch (err) {
        setError(err.message || "Could not load profile");
        } finally {
        setLoading(false);
        }
    }

    loadProfile();
  }, []);

  const handleSaveBio = async (newBio) => {
    if (!profile) return;
    try {
      setSavingBio(true);
      const updated = await updateProfileBio(profile.id, newBio);
      setProfile(updated);
    } catch (err) {
      setError(err.message || "Could not save bio");
    } finally {
      setSavingBio(false);
    }
  };

  const handleSaveDetails = async (details) => {
    if (!profile) return;
    setSavingDetails(true);
    try {
      const updated = await updateProfileDetails(profile.id, details);
      setProfile(updated);
    } catch (err) {
      setError(err.message || "Could not save profile details");
    } finally {
      setSavingDetails(false);
    }
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
        <ProfileDetails profile={profile} loading={loading} saving={savingDetails}
          onSaveDetails={handleSaveDetails} />
      </div>

      <ProfileBio
        profile={profile}
        loading={loading}
        saving={savingBio}
        onSaveBio={handleSaveBio}
      />
    </div>
  );
}
