import { useEffect, useState } from "react";
import { getCategories, addPrompt } from "../api/api";

export default function AddPrompt() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const data = getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!category) return setError("Please select a category");
    if (!prompt.trim()) return setError("Prompt cannot be empty");

    try {
      await addPrompt(category, prompt);
      setMessage("Prompt added successfully!");
      setPrompt("");
      setCategory("");
    } catch (err) {
      console.error(err);
      setError("Failed to add prompt");
    }
  };

  if (error && !categories.length) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add a New Prompt</h2>

      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Select Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select --</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your prompt..."
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Prompt
        </button>
      </form>
    </div>
  );
}
