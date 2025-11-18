import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { updateCurrentUser } from "../services/users";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    bio: "",
    personality_type: "",
    nearest_city: "",
    hobbies: "",
  });

  const limits = {
    username: 50,
    bio: 500,
    personality_type: 50,
    nearest_city: 100,
    hobbies: 255,
  };

  const update = (k) => (e) => {
    const raw = e.target.value || "";
    const max = limits[k];
    const next = raw.length > max ? raw.slice(0, max) : raw;
    setForm((f) => ({ ...f, [k]: next }));
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <div className="card p-8 sm:p-10 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-primary-600)] text-white shadow">
              {/* Icon placeholder: could add a user icon here if desired */}
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Complete your profile
              </h1>
              <p className="text-[var(--color-muted)] mt-1">
                Choose a username and optionally fill in a few details. You can
                edit these later.
              </p>
            </div>
          </div>

          <form
            className="mt-2 grid gap-6"
            onSubmit={async (e) => {
              e.preventDefault();
              // Build minimal patch to avoid overwriting unspecified fields
              const patch = Object.fromEntries(
                Object.entries(form).filter(
                  ([, v]) => v !== "" && v !== null && v !== undefined
                )
              );
              try {
                setError("");
                await updateCurrentUser(patch);
                navigate("/profile");
              } catch (err) {
                setError(err.message || "Could not update profile");
              }
            }}
          >
            {error && (
              <div className="text-red-500 text-sm md:text-base">{error}</div>
            )}
            <div>
              <label className="block text-sm md:text-xl font-medium text-[var(--color-muted)]">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={limits.username}
                className="mt-1 block w-full rounded-md border border-transparent bg-white/80 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] text-black text-sm md:text-lg"
                placeholder="your_username (max 50 chars)"
                required
                value={form.username}
                onChange={update("username")}
              />
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {form.username.length}/{limits.username}
              </p>
            </div>

            <div>
              <label className="block text-sm md:text-xl font-medium text-[var(--color-muted)]">
                Bio
              </label>
              <textarea
                rows={3}
                maxLength={limits.bio}
                className="mt-1 block w-full rounded-md border border-transparent bg-white/80 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] text-black text-sm md:text-lg"
                placeholder="Tell others a bit about you (max 500 chars)"
                value={form.bio}
                onChange={update("bio")}
              />
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {form.bio.length}/{limits.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm md:text-xl font-medium text-[var(--color-muted)]">
                  Personality Type
                </label>
                <input
                  type="text"
                  maxLength={limits.personality_type}
                  className="mt-1 block w-full rounded-md border border-transparent bg-white/80 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] text-black text-sm md:text-lg"
                  placeholder="e.g., introvert/extrovert"
                  value={form.personality_type}
                  onChange={update("personality_type")}
                />
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {form.personality_type.length}/{limits.personality_type}
                </p>
              </div>
              <div>
                <label className="block text-sm md:text-xl font-medium text-[var(--color-muted)]">
                  Nearest City
                </label>
                <input
                  type="text"
                  maxLength={limits.nearest_city}
                  className="mt-1 block w-full rounded-md border border-transparent bg-white/80 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] text-black text-sm md:text-lg"
                  placeholder="e.g., San Francisco (max 100 chars)"
                  value={form.nearest_city}
                  onChange={update("nearest_city")}
                />
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {form.nearest_city.length}/{limits.nearest_city}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm md:text-xl font-medium text-[var(--color-muted)]">
                Hobbies
              </label>
              <input
                type="text"
                maxLength={limits.hobbies}
                className="mt-1 block w-full rounded-md border border-transparent bg-white/80 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] text-black text-sm md:text-lg"
                placeholder="e.g., hiking, cooking, chess (max 255 chars)"
                value={form.hobbies}
                onChange={update("hobbies")}
              />
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {form.hobbies.length}/{limits.hobbies}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary px-6">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
