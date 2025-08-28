import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Prompts() {
  const { category } = useParams();
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    // Check if localStorage has updated prompts
    const saved = localStorage.getItem("promptsData");

    if (saved) {
      const parsed = JSON.parse(saved);
      setPrompts(parsed[category] || []);
    } else {
      // Fallback: fetch default from public/prompts.json
      fetch("/prompts.json")
        .then((res) => res.json())
        .then((data) => {
          setPrompts(data[category] || []);
        });
    }
  }, [category]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 capitalize">{category} Prompts</h2>
      {prompts.length > 0 ? (
        <ul className="space-y-2">
          {prompts.map((p, i) => (
            <li key={i} className="bg-gray-100 p-3 rounded shadow">{p}</li>
          ))}
        </ul>
      ) : (
        <p>No prompts available.</p>
      )}
    </div>
  );
}
