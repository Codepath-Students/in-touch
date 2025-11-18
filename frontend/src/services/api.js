import axios from "axios";

const baseURL = (import.meta?.env?.VITE_BACKEND_URL || "").replace(/\/$/, "");

const api = axios.create({
  baseURL: baseURL ? `${baseURL}/api` : "/api",
  withCredentials: true, // allow cookies for refresh routes when needed
});

// Access token management (in-memory)
let ACCESS_TOKEN = null;
export function setAccessToken(token) {
  ACCESS_TOKEN = token || null;
  if (ACCESS_TOKEN) {
    api.defaults.headers.common["Authorization"] = `Bearer ${ACCESS_TOKEN}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// CSRF bootstrap: fetch CSRF token once and set it as a default header
let csrfInitialized = false;
export async function ensureCsrf() {
  if (csrfInitialized) return;
  try {
    const res = await api.get(`/auth/csrf-token`);
    const token = res.data?.csrfToken;
    if (token) {
      api.defaults.headers.common["x-csrf-token"] = token;
      csrfInitialized = true;
    }
  } catch (e) {
    // noop; server might not require it for GETs
  }
}

// Auto-init on import for convenience; callers can await ensureCsrf() explicitly as well
ensureCsrf();

export default api;
