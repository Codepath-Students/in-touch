import axios from "axios";

const baseURL = (import.meta?.env?.VITE_BACKEND_URL || "").replace(/\/$/, "");

const api = axios.create({
  baseURL: baseURL ? `${baseURL}/api` : "/api",
  withCredentials: true, // allow cookies for refresh routes when needed
});

export default api;
