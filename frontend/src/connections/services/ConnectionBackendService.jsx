// src/services/ConnectionService.js

const API_BASE = "/api/connections";

/**
 * Helper to build headers with JWT + CSRF.
 * - accessToken should be stored in localStorage under "accessToken"
 * - csrfToken should be stored in localStorage under "csrfToken"
 *   (fetched from GET /api/auth/csrf-token)
 */
function getAuthHeaders({ json = true } = {}) {
  const headers = {};

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const csrfToken = localStorage.getItem("csrfToken");
  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  return headers;
}

/**
 * Fetch connections for the current user.
 * Internally uses GET /api/connections/page/1 but just returns the array.
 * Backend response: { connections, page, hasNext }
 */
export async function fetchConnections() {
  const res = await fetch(`${API_BASE}/page/1`, {
    method: "GET",
    headers: getAuthHeaders({ json: false }),
    credentials: "include",
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // ignore JSON parse errors for non-2xx; we'll handle via status below
  }

  if (!res.ok) {
    const message =
      data?.error || data?.message || "Failed to load connections";
    throw new Error(message);
  }

  // data should be { connections, page, hasNext }
  return data?.connections || [];
}

/**
 * Create a new connection.
 *
 * Body shape expected by backend:
 * {
 *   connection_name: string (required, <= 100),
 *   reminder_frequency_days: number (required, > 0),
 *   reach_out_priority?: number (0..10),
 *   notes?: string,
 *   connection_type?: string,
 *   know_from?: string
 * }
 *
 * Backend response:
 *   { connection: { id, connection_name, reach_out_priority, reminder_frequency_days, created_at, last_contacted_at } }
 */
export async function addConnection(payload) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // ignore; handle by status
  }

  if (!res.ok) {
    const message = data?.error || data?.message || "Failed to add connection";
    throw new Error(message);
  }

  // { connection: {...} }
  return data;
}

/**
 * Update an existing connection.
 *
 * Backend:
 *   PUT /api/connections/:connectionId
 * Body: any subset of
 * {
 *   connection_name?,
 *   reach_out_priority?,
 *   reminder_frequency_days?,
 *   notes?,
 *   connection_type?,
 *   know_from?
 * }
 *
 * Response:
 *   { connection: {...updated...} }
 */
export async function updateConnection(connectionId, payload) {
  const res = await fetch(`${API_BASE}/${connectionId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    const message =
      data?.error || data?.message || "Failed to update connection";
    throw new Error(message);
  }

  return data; // { connection }
}

/**
 * Delete a connection.
 *
 * Backend:
 *   DELETE /api/connections/:connectionId
 * Response:
 *   204 No Content on success
 */
export async function deleteConnection(connectionId) {
  const res = await fetch(`${API_BASE}/${connectionId}`, {
    method: "DELETE",
    headers: getAuthHeaders({ json: false }),
    credentials: "include",
  });

  if (!res.ok) {
    let data = null;
    try {
      data = await res.json();
    } catch (e) {}
    const message =
      data?.error || data?.message || "Failed to delete connection";
    throw new Error(message);
  }

  // 204: nothing in body
  return { success: true };
}

/**
 * Mark that the user reached out to this connection.
 *
 * NOTE: your current backend code does NOT yet define this route.
 * To use this function, add something like:
 *
 *   POST /api/connections/:connectionId/reached-out
 *     - requires auth + CSRF
 *     - sets last_contacted_at = NOW()
 *     - returns { connection: {...updated...} }
 */
export async function markReachedOut(connectionId) {
  const res = await fetch(`${API_BASE}/${connectionId}/reached-out`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    const message =
      data?.error || data?.message || "Failed to mark as reached out";
    throw new Error(message);
  }

  return data; // { connection }
}
