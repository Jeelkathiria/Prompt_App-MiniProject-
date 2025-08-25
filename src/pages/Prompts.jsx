import { useParams } from "react-router-dom";

export default function Prompts() {
  const { category } = useParams();

  const dummyPrompts = {
    coding: ["Write a binary search algorithm", "Explain closures in JS"],
    writing: ["Write a story about AI", "Describe a peaceful morning"],
    design: ["Create a modern dashboard UI", "Design a minimal logo"],
    ideas: ["Startup idea for 2025", "Best marketing strategy for apps"],
  };

  const prompts = dummyPrompts[category] || [];

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
