import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, addCategory } from "../api";
import { Plus } from "lucide-react"; // ✅ beautiful icon (lucide built-in with shadcn)

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [search, setSearch] = useState("");

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
      loadCategories();
    }
  };

  // Filtered categories for search
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
          {/* Add Category box */}
          <div
            onClick={() => {
              const name = prompt("Enter new category name:");
              if (name) {
                setNewCategory(name);
                setTimeout(handleAddCategory, 100);
              }
            }}
            className="cursor-pointer border-2 border-dashed border-blue-400 bg-white/60 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-8 transition hover:scale-105 hover:bg-blue-50 shadow-md"
          >
            <Plus className="text-blue-500 w-10 h-10 mb-2" />
            <span className="text-blue-600 font-semibold">Add Category</span>
          </div>

          {/* Render category boxes */}
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
    </div>
  );
}
