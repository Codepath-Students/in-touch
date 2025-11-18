import api, { ensureCsrf } from "./api";

// Shapes per backend/docs: backend/docs/Users.md
// GET /api/users -> { user: { ...fields } }
export async function getCurrentUser() {
  const res = await api.get("/users");
  return res.data?.user;
}

// PUT /api/users -> { user: { ...fields } }
// Accepts a partial payload; only send fields to change to avoid overwrites
export async function updateCurrentUser(patch = {}) {
  try {
    await ensureCsrf();
    // whitelist only permitted fields to avoid accidental overwrite
    const allowed = [
      "username",
      "display_name",
      "profile_picture_url",
      "bio",
      "personality_type",
      "nearest_city",
      "hobbies",
    ];
    const body = Object.fromEntries(
      Object.entries(patch).filter(
        ([k, v]) => allowed.includes(k) && v !== undefined
      )
    );
    const res = await api.put("/users", body);
    return res.data?.user;
  } catch (err) {
    const status = err?.response?.status;
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      "Update failed";
    if (status === 400 && /Username already in use/i.test(message)) {
      throw Object.assign(new Error("Username already in use"), {
        code: "USERNAME_TAKEN",
        message: "Username already in use",
      });
    }
    if (status === 401) {
      throw Object.assign(new Error("Unauthorized"), {
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    throw Object.assign(new Error(message), { code: "UNKNOWN" });
  }
}
