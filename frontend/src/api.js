// frontend/src/api.js
import axios from "axios";

// -----------------------------------------------------
// 🌐 Base Configuration
// -----------------------------------------------------
const API_BASE = "http://localhost:5000/api";

// Create a single Axios instance for all requests
const API = axios.create({ baseURL: API_BASE });

// Automatically attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// -----------------------------------------------------
// 🔐 AUTH API (Register / Login)
// -----------------------------------------------------
export const registerUser = async (formData) => {
  try {
    const res = await API.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Registration failed" };
  }
};

export const loginUser = async (userData) => {
  try {
    const res = await API.post("/auth/login", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Login failed" };
  }
};

// -----------------------------------------------------
// 🧩 PROMPTS API
// -----------------------------------------------------
export const getPrompts = async () => {
  try {
    const res = await API.get("/prompts");
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch prompts" };
  }
};

export const addPrompt = async (formData) => {
  try {
    const res = await API.post("/prompts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to add prompt" };
  }
};

// -----------------------------------------------------
// 🧱 CATEGORY API
// -----------------------------------------------------
export const getCategories = async () => {
  try {
    const res = await API.get("/categories");
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch categories" };
  }
};

export const addCategory = async (name) => {
  try {
    const res = await API.post("/categories", { name });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to add category" };
  }
};

// -----------------------------------------------------
// 💬 COMMENTS API
// -----------------------------------------------------
export const getComments = async (promptId) => {
  try {
    const res = await API.get(`/prompts/${promptId}/comments`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch comments" };
  }
};

export const addComment = async (promptId, comment) => {
  try {
    const res = await API.post(`/prompts/${promptId}/comments`, comment);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to add comment" };
  }
};
