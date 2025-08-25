import { Link } from "react-router-dom";

export default function Categories() {
  const categories = ["Coding", "Writing", "Design", "Ideas"];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Browse Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {categories.map((cat, index) => (
          <Link
            key={index}
            to={`/prompts/${cat.toLowerCase()}`}
            className="block bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-transform text-center"
          >
            <h3 className="text-xl font-semibold text-gray-700">{cat}</h3>
            <p className="text-gray-500 text-sm mt-2">View all {cat} prompts</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
