import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, addCategory } from "../api";
import { Plus, X } from "lucide-react"; // ✅ X for close icon

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data.map((c) => c.name));
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Please enter a category name");
    const response = await addCategory(newCategory.trim());
    if (response.error) {
      alert(response.error);
    } else {
      setNewCategory("");
      setShowModal(false);
      loadCategories();
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center tracking-wide">
          📂 Explore or Add Categories
        </h1>

        {/* Search bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg border border-gray-300 rounded-full py-2.5 px-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Add Category Box */}
          <div
            onClick={() => setShowModal(true)}
            className="cursor-pointer border-2 border-dashed border-blue-400 bg-white/60 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-8 transition hover:scale-105 hover:bg-blue-50 shadow-md"
          >
            <Plus className="text-blue-500 w-10 h-10 mb-2" />
            <span className="text-blue-600 font-semibold">Add Category</span>
          </div>

          {/* Render Category Boxes */}
          {filteredCategories.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No categories found
            </p>
          ) : (
            filteredCategories.map((cat) => (
              <Link
                key={cat}
                to={`/prompts/${cat}`}
                className="rounded-2xl shadow-md bg-white/70 backdrop-blur-md border border-gray-200 flex flex-col justify-center items-center p-6 hover:scale-105 hover:shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <h2 className="text-xl font-semibold tracking-wide">{cat}</h2>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              ➕ Add New Category
            </h2>

            <input
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
