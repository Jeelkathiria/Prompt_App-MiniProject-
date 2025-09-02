import { useState, useEffect } from "react";

export default function AddPrompt() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [promptsData, setPromptsData] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // ✅ Fetch categories & prompts from JSON
  useEffect(() => {
    fetch("/prompts.json")
      .then((res) => res.json())
      .then((data) => {
        setPromptsData(data);
        setCategories(Object.keys(data));
      })
      .catch((err) => console.error("Error loading prompts:", err));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (category.trim() === "") {
      return showToast("⚠️ Please select a category.", "error");
    }
    if (prompt.trim() === "") {
      return showToast("⚠️ Prompt cannot be empty.", "error");
    }
    if (prompt.length < 10) {
      return showToast("⚠️ Prompt should be at least 10 characters long.", "error");
    }

    // ✅ Check duplicates
    if (promptsData[category]?.includes(prompt)) {
      return showToast("⚠️ This prompt already exists in this category.", "error");
    }

    // ✅ Update local state (simulate API save)
    const updatedData = { ...promptsData };
    if (!updatedData[category]) updatedData[category] = [];
    updatedData[category].push(prompt);

    setPromptsData(updatedData);

    showToast("✅ Prompt added successfully!", "success");

    // Clear inputs
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

      {/* 🔔 Toast Popup */}
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
