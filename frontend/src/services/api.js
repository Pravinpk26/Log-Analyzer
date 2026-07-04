/**
 * api.js — Frontend API Service
 * All backend calls go through here.
 * Automatically attaches JWT token to every request.
 * Auto-logout on 401 (token expired).
 */

const BASE = "";  // Vite proxy handles routing to http://127.0.0.1:8000

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    localStorage.clear();
    window.location.reload();
    throw new Error("Session expired.");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

/** Verify stored JWT token is still valid */
export async function verifyToken() {
  return apiFetch("/verify");
}

/** Full website scan */
export async function scanWebsite(url) {
  return apiFetch(`/scan?url=${encodeURIComponent(url)}`);
}

/** All stored authentication events */
export async function getEvents() {
  return apiFetch("/events");
}

/** Upload a log file (JSON or CSV) */
export async function uploadLog(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE}/upload-log`, {
    method:  "POST",
    headers: authHeader(),
    body:    formData,
  });
  if (res.status === 401) { localStorage.clear(); window.location.reload(); throw new Error("Session expired."); }
  if (!res.ok) throw new Error("Upload failed.");
  return res.json();
}
