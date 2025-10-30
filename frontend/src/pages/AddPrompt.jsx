import React, { useState, useEffect } from "react";
import { addPrompt, getCategories } from "../api";

export default function AddPrompt() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Fetch categories from MongoDB
  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      const names = data.map((c) => c.name);
      setCategories(names);
      setForm((prev) => ({ ...prev, category: names[0] || "" }));
      setLoading(false);
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return alert("Please select a category first.");
    await addPrompt(form);
    setSuccess(true);
    setForm({ title: "", category: categories[0] || "", description: "" });
    setTimeout(() => setSuccess(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg animate-pulse">
          Fetching categories...
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/60 border border-gray-200 rounded-2xl shadow-lg p-8 transition-transform hover:scale-[1.01]">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          🧠 Add a New Prompt
        </h1>

        {success && (
          <div className="bg-green-100 border border-green-300 text-green-700 text-center p-2 mb-4 rounded-md">
            ✅ Prompt added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title input */}
          <div>
            <label className="block text-left font-semibold mb-1 text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter your prompt title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Category dropdown */}
          <div>
            <label className="block text-left font-semibold mb-1 text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              {categories.length === 0 ? (
                <option>No categories available</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Description textarea */}
          <div>
            <label className="block text-left font-semibold mb-1 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the prompt idea..."
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-[2px]"
          >
            Add Prompt
          </button>
        </form>
      </div>
    </div>
  );
}
