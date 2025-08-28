import { Link } from "react-router-dom";

const categoriesData = [
  { id: 1, name: "coding", description: "All about programming prompts" },
  { id: 2, name: "writing", description: "Creative and story prompts" },
  { id: 3, name: "design", description: "UI/UX and design ideas" },
  { id: 4, name: "ideas", description: "Random brainstorm prompts" },
];

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
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Browse Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {categoriesData.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}
