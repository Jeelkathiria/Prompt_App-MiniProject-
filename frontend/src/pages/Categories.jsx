import { useEffect, useState } from "react";
import { getCategories } from "../api/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
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

  if (error) return <p className="text-red-500">{error}</p>;
  if (!categories.length) return <p>Loading categories...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <ul className="list-disc ml-6">
        {categories.map((cat, index) => (
          <li key={index} className="text-gray-700">{cat}</li>
        ))}
      </ul>
    </div>
  );
}
