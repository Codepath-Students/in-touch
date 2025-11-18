// src/services/ProfileService.js

const MOCK = true;

// Demo profile shaped like the users table
const mockProfile = {
  id: 1,
  email: "maria@example.com",
  display_name: "Maria Fernanda",
  username: "mariaf",
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
  last_login_at: new Date().toISOString(),
  is_email_verified: true,
  // Optional profile info
  profile_picture_url: "",
  bio: "Beatmaker crafting melancholic trap vibes. Always open to new collabs.",
  personality_type: "INTJ",
  nearest_city: "Los Angeles, CA",
  hobbies: "Music production, Hiking, Reading",
};

// Simulate network delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProfile() {
  if (MOCK) {
    await delay(400);
    return { ...mockProfile };
  }

  // Example real API call (adjust URL as needed)
  const res = await fetch("/api/profile");
  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }
  return res.json();
}

export async function updateProfileBio(id, newBio) {
  if (MOCK) {
    await delay(400);
    mockProfile.bio = newBio;
    return { ...mockProfile };
  }

  // Example real API call for updating bio
  const res = await fetch(`/api/profile/${id}/bio`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bio: newBio }),
  });

  if (!res.ok) {
    throw new Error("Failed to update bio");
  }
  return res.json();
}

export async function updateProfileDetails(id, details) {
  if (MOCK) {
    await delay(400);
    // Only allow updating editable fields
    const allowed = [
      "display_name",
      "username",
      "personality_type",
      "nearest_city",
      "hobbies",
    ];
    for (const k of allowed) {
      if (k in details) mockProfile[k] = details[k];
    }
    return { ...mockProfile };
  }

  // This is your "new route"
  const res = await fetch(`/api/profile/${id}/details`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  });

  if (!res.ok) throw new Error("Failed to update profile details");
  return res.json();
}

// Unified update method that accepts a partial patch object
export async function updateProfile(id, patch) {
  if (MOCK) {
    await delay(400);
    const allowed = new Set([
      "display_name",
      "username",
      "personality_type",
      "nearest_city",
      "hobbies",
      "bio",
      "profile_picture_url",
    ]);
    for (const [k, v] of Object.entries(patch || {})) {
      if (allowed.has(k)) mockProfile[k] = v;
    }
    return { ...mockProfile };
  }

  // Single endpoint to update any profile fields (adjust to match backend)
  const res = await fetch(`/api/profile/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch || {}),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}
