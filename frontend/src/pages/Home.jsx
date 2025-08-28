import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-700"></div>
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <h1 className="text-6xl font-extrabold mb-6 text-white relative z-10">
        Welcome to <span className="text-blue-300">Prompt Collection</span>
      </h1>
      <p className="text-xl text-gray-200 max-w-2xl mb-10 relative z-10">
        Organize, store, and explore your favorite prompts with ease.
      </p>

      <Link
        to="/categories"
        className="bg-blue-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition relative z-10"
      >
        Get Started
      </Link>
    </div>
  );
}
