// src/components/profile/ProfileHeader.jsx
import React from "react";
import "./ProfileHeader.css";

export default function ProfileHeader({ profile, loading }) {

  let name = "Loading...";
  if (!loading && profile && (profile.firstname || profile.lastname)) {
    name = [profile.firstname, profile.lastname].filter(Boolean).join(" ");
  } else if (!loading && (!profile || (!profile.firstname && !profile.lastname))) {
    name = "Unknown User";
  }

  const initials = !loading && profile && profile.firstname
    ? profile.firstname
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .join("")
        .slice(0, 2)
    : "MF";

  return (
    <section className="profile-header-card">
      <div className="profile-header-avatar-ring">
        <div className="profile-header-avatar">
          <span className="profile-header-initials">{initials}</span>
        </div>
      </div>

      <div className="profile-header-text">
        <h2 className="profile-header-name">{name}</h2>
        <p className="profile-header-tagline">Premium User</p>
      </div>
    </section>
  );
}
