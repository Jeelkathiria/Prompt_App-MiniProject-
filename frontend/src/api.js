// frontend/src/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// -----------------------------------------------------
// 🧩 Using a single Axios instance for all requests
// -----------------------------------------------------
const API = axios.create({ baseURL: API_BASE });

// Attach token automatically to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// -----------------------------------------------------
// 🧠 PROMPTS API
// -----------------------------------------------------
export const getPrompts = async () => {
  const res = await API.get("/prompts");
  return res.data;
};

export const addPrompt = async (data) => {
  const res = await API.post("/prompts", data);
  return res.data;
};

// -----------------------------------------------------
// 🧱 CATEGORY API
// -----------------------------------------------------
export const getCategories = async () => {
  const res = await API.get("/categories");
  return res.data;
};

export const addCategory = async (name) => {
  const res = await API.post("/categories", { name });
  return res.data;
};

// -----------------------------------------------------
// 🔐 AUTH API (Login / Register)
// -----------------------------------------------------


export const registerUser = async (formData) => {
  const res = await API.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await API.post("/auth/login", userData);
  return res.data;
};


//All Prompts
export const getAllPrompts = async () => {
  const res = await API.get("/allPrompts");
  return res.data;
};

export const getComments = async (id) => {
  const res = await fetch(`http://localhost:5000/api/prompts/${id}`);
  const data = await res.json();
  return data.comments || [];
};

export const addComment = async (id, name, text) => {
  const res = await fetch(`http://localhost:5000/api/prompts/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, text }),
  });
  return await res.json();
};
