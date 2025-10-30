import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPrompts } from "../api";

export default function Prompts() {
  const { category } = useParams();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrompts() {
      setLoading(true);
      const data = await getPrompts();
      const filtered = data.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
      setPrompts(filtered);
      setLoading(false);
    }
    fetchPrompts();
  }, [category]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Prompts in <span className="text-blue-600">{category}</span>
      </h1>

      {loading ? (
        <p>Loading prompts...</p>
      ) : prompts.length === 0 ? (
        <p className="text-gray-500">No prompts found for this category.</p>
      ) : (
        <ul className="space-y-3">
          {prompts.map((p) => (
            <li key={p._id} className="border border-gray-300 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{p.title}</h2>
              <p className="text-gray-500 italic">{p.category}</p>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
``
