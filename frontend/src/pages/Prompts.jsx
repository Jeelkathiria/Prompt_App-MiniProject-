import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Prompts() {
  const { category } = useParams();
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    // ✅ Fetch prompts from API (here public/prompts.json acts like API)
    fetch("/prompts.json")
      .then((res) => res.json())
      .then((data) => {
        setPrompts(data[category] || []);
      })
      .catch((err) => console.error("Error loading prompts:", err));
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 capitalize">
        {category} Prompts
      </h2>

      {prompts.length > 0 ? (
        <ul className="max-w-3xl mx-auto space-y-4">
          {prompts.map((p, idx) => (
            <li
              key={idx}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md"
            >
              {p}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No prompts available.</p>
      )}
    </div>
  );
}
