import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')",
        }}
      ></div>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <h1 className="text-6xl font-extrabold mb-6 text-white drop-shadow-lg relative z-10">
        Welcome to <span className="text-blue-400">Prompt Collection</span>
      </h1>
      <p className="text-xl text-gray-200 max-w-2xl mb-10 relative z-10">
        Organize, store, and explore your favorite prompts with a clean and modern experience.
      </p>

      <Link
        to="/categories"
        className="bg-blue-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 hover:shadow-2xl transform hover:scale-[1.07] transition relative z-10"
      >
        Get Started
      </Link>
    </div>
  );
}
