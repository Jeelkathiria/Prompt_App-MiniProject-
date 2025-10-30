// src/api.js

const API_BASE = "http://localhost:5000/api";

// ---------- PROMPT API ----------
export async function getPrompts() {
  const res = await fetch(`${API_BASE}/prompts`);
  return res.json();
}

export async function addPrompt(data) {
  const res = await fetch(`${API_BASE}/prompts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---------- CATEGORY API ----------
export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return res.json();
}

export async function addCategory(name) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}
