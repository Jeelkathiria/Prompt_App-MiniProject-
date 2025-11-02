import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPrompts } from "../api";
import { Search, Clipboard, Check } from "lucide-react";

export default function Prompts() {
  const { category } = useParams();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [showToast, setShowToast] = useState(false);

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

  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setShowToast(true);

      // let the rotation + tick fully play before resetting
      setTimeout(() => setCopiedId(null), 1500);
      setTimeout(() => setShowToast(false), 1600);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const filteredPrompts = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        Prompts in <span className="text-blue-600">{category}</span>
      </h1>

      {/* Search bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-[60%]">
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full py-2.5 px-4 pr-10 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Prompts */}
      {loading ? (
        <p className="text-center text-gray-500">Loading prompts...</p>
      ) : filteredPrompts.length === 0 ? (
        <p className="text-center text-gray-500">
          No prompts found for this category.
        </p>
      ) : (
        <ul className="space-y-3 max-w-4xl mx-auto">
          {filteredPrompts.map((p) => (
            <li
              key={p._id}
              className="relative border border-gray-300 rounded-xl p-4 shadow-sm bg-white/70 backdrop-blur-md hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">{p.title}</h2>
              <p className="text-sm text-blue-600 italic">{p.category}</p>
              <p className="text-gray-600 mt-1 pr-8">{p.description}</p>

              {/* Copy Icon */}
              <button
                onClick={() => handleCopy(p._id, p.description)}
                className="absolute bottom-3 right-3 text-gray-400 hover:text-blue-500 transition"
              >
                <div
                  className={`w-5 h-5 transition-transform duration-700 ${
                    copiedId === p._id ? "rotate-[360deg]" : "rotate-0"
                  }`}
                >
                  {copiedId === p._id ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clipboard className="w-5 h-5" />
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Copied Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-md animate-fadeInOut z-50">
          Copied!
        </div>
      )}

      {/* Custom animations */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(20px); }
          }
          .animate-fadeInOut {
            animation: fadeInOut 1.2s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
}
