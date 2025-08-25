import { useState } from "react";

export default function AddPrompt() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Prompt Added!\nCategory: ${category}\nPrompt: ${prompt}`);
    setPrompt("");
    setCategory("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Prompt</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <input
              type="text"
              placeholder="Enter category (e.g. Coding, Writing)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Prompt Textarea */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Prompt</label>
            <textarea
              placeholder="Enter your prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows="5"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-transform transform hover:scale-[1.02]"
          >
            Add Prompt
          </button>
        </form>
      </div>
    </div>
  );
}
