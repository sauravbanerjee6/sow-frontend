// src/utils/auth.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = "sow_token";

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  setToken(null);
  window.location.href = "/login";
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // throw with server message if present
    throw new Error(data.error || data.message || "Login failed");
  }

  if (data.token) {
    setToken(data.token);
  }
  return data;
}

export async function authFetch(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const token = getToken();

  const headers = {
    ...(opts.headers || {}),
    "Content-Type":
      opts.body && !(opts.body instanceof FormData)
        ? "application/json"
        : undefined,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...opts,
    headers,
  });

  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized - please login again");
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      body.error || body.message || `Request failed: ${res.status}`
    );
  }

  return body;
}
