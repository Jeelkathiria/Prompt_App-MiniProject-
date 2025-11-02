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
export const registerUser = async (userData) => {
  const res = await API.post("/auth/register", userData);
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
