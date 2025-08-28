// frontend/src/api/api.js
const API_URL = "http://localhost:5000/api/prompts";

// Get all categories (fixed categories for now)
export const getCategories = async () => {
  return ["Coding", "Idea", "Writing", "Design"];
};

// Fetch all prompts from backend
export const getPrompts = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

// Add new prompt to backend
export const addPrompt = async (category, prompt) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, prompt }),
  });
  return await res.json();
};
