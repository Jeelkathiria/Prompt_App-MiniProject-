import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPrompts } from "../api/api";

export default function Prompts() {
  const { category } = useParams();
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    getPrompts()
      .then(res => {
        if (category) {
          setPrompts(res.data.filter(p => p.category.toLowerCase() === category));
        } else {
          setPrompts(res.data);
        }
      })
      .catch(err => console.error(err));
  }, [category]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{category ? `${category} Prompts` : "All Prompts"}</h2>

      {prompts.length > 0 ? (
        <ul className="space-y-2">
          {prompts.map((p, i) => (
            <li key={i} className="bg-gray-100 p-3 rounded">
              <strong className="capitalize">{p.category}</strong>: {p.prompt}
            </li>
          ))}
        </ul>
      ) : (
        <p>No prompts available.</p>
      )}
    </div>
  );
}
