import { useState, useEffect } from "react";

export default function AddPrompt() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const saved = localStorage.getItem("promptsData");
    if (saved) {
      setCategories(Object.keys(JSON.parse(saved)));
    } else {
      fetch("/prompts.json")
        .then((res) => res.json())
        .then((data) => setCategories(Object.keys(data)));
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ JS-only validation
    if (category.trim() === "") {
      return showToast("⚠️ Please select a category.", "error");
    }
    if (prompt.trim() === "") {
      return showToast("⚠️ Prompt cannot be empty.", "error");
    }
    if (prompt.length < 10) {
      return showToast("⚠️ Prompt should be at least 10 characters long.", "error");
    }

    let updatedData = {};
    const saved = localStorage.getItem("promptsData");
    if (saved) {
      updatedData = JSON.parse(saved);
    }

    if (!updatedData[category]) updatedData[category] = [];

    if (updatedData[category].includes(prompt)) {
      return showToast("⚠️ This prompt already exists in this category.", "error");
    }

    updatedData[category].push(prompt);
    localStorage.setItem("promptsData", JSON.stringify(updatedData));

    showToast("✅ Prompt added successfully!", "success");

    setPrompt("");
    setCategory("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 relative">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          ➕ Add New Prompt
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">-- Select a category --</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt Textarea */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Prompt</label>
            <textarea
              placeholder="Enter your prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              rows="5"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform"
          >
            Add Prompt
          </button>
        </form>
      </div>

      {/* 🔔 Toast Popup (Top Right) */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-lg shadow-xl text-white text-sm font-medium transition-all duration-500 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
