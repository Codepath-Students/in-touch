// src/services/ProfileService.js

const MOCK = true;

// Simple demo profile used when MOCK === true
const mockProfile = {
  id: 1,
  firstname: "Maria",
  lastname: "Fernanda",
  role: "Beatmaker",
  experienceLevel: "Intermediate",
  city: "California, USA",
  availability: "Available for collaboration",
  bio: "Beatmaker crafting melancholic trap vibes. Always open to new collabs."
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
    body: JSON.stringify({ bio: newBio })
  });

  if (!res.ok) {
    throw new Error("Failed to update bio");
  }
  return res.json();
}

export async function updateProfileDetails(id, details) {
  if (MOCK) {
    await delay(400);
    Object.assign(mockProfile, details);
    return { ...mockProfile };
  }

  // This is your "new route"
  const res = await fetch(`/api/profile/${id}/details`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details)
  });

  if (!res.ok) throw new Error("Failed to update profile details");
  return res.json();
}