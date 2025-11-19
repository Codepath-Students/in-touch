// src/services/ConnectionBackendService.js
import api, { ensureCsrf } from "../../services/api"; // ⬅ adjust path if needed

// Make sure the Authorization header is set from localStorage if missing.
// This covers the case where login only saved to localStorage but didn't call setAccessToken.
function ensureAuthHeader() {
  if (!api.defaults.headers.common["Authorization"]) {
    try {
      const token = window?.localStorage?.getItem("access_token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      // ignore
    }
  }
}

// -------------------- READ --------------------

export async function fetchConnections() {
  ensureAuthHeader();
  const res = await api.get("/connections");
  return res.data.connections;
}

export async function getConnectionDetails(connectionId) {
  ensureAuthHeader();
  const res = await api.get(`/connections/${connectionId}`);
  return res.data.connection;
}

// -------------------- WRITE (needs CSRF + token) --------------------

export async function addConnection(data) {
  await ensureCsrf();
  ensureAuthHeader();
  const res = await api.post("/connections/create", data);
  return res.data.connection;
}

export async function updateConnection(connectionId, data) {
  await ensureCsrf();
  ensureAuthHeader();
  const res = await api.put(`/connections/edit/${connectionId}`, data);
  return res.data.connection;
}

export async function deleteConnection(connectionId) {
  await ensureCsrf();
  ensureAuthHeader();
  await api.delete(`/connections/${connectionId}`);
}

export async function markReachedOut(connectionId) {
  await ensureCsrf();
  ensureAuthHeader();
  const res = await api.post(`/connections/${connectionId}/reached-out`, {});
  return res.data.connection;
}
