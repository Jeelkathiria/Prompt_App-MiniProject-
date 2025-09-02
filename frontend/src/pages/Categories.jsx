import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CategoryCard({ cat }) {
  return (
    <Link
      to={`/prompts/${cat.name}`}
      className="block bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-transform text-center"
    >
      <h3 className="text-xl font-semibold text-gray-700 capitalize">
        {cat.name}
      </h3>
      <p className="text-gray-500 text-sm mt-2">{cat.description}</p>
    </Link>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/prompts.json")
      .then((res) => res.json())
      .then((data) => {
        // ✅ Only keep the 4 fixed categories if they exist in JSON
        const fixed = ["coding", "writing", "design", "ideas"];
        const filtered = fixed.map((cat, idx) => ({
          id: idx + 1,
          name: cat,
          description: `Explore ${cat} related prompts`,
        }));
        setCategories(filtered);
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Browse Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}
