import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPrompts } from "../api";
import { Search, Clipboard, Check, X } from "lucide-react";

export default function Prompts() {
  const { category } = useParams();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 6;

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
      setTimeout(() => setCopiedId(null), 1500);
      setTimeout(() => setShowToast(false), 1600);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // 🔍 Filter
  const filteredPrompts = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Pagination
  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);
  const startIndex = (currentPage - 1) * promptsPerPage;
  const currentPrompts = filteredPrompts.slice(
    startIndex,
    startIndex + promptsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        Prompts in <span className="text-blue-600">{category}</span>
      </h1>

      {/* 🔍 Search Bar */}
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

      {/* 📜 Prompts List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading prompts...</p>
      ) : currentPrompts.length === 0 ? (
        <p className="text-center text-gray-500">
          No prompts found for this category.
        </p>
      ) : (
        <ul className="space-y-3 max-w-4xl mx-auto">
          {currentPrompts.map((p) => (
            <li
              key={p._id}
              className="relative border border-gray-300 rounded-xl p-4 shadow-sm bg-white/70 backdrop-blur-md hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">{p.title}</h2>
              <p className="text-sm text-blue-600 italic">{p.category}</p>
              <p className="text-gray-600 mt-1 pr-8">{p.description}</p>

              {/* 🔗 Result Link (Bottom Right) */}
              <div className="absolute bottom-3 right-10">
                <button
                  onClick={() => setSelectedPrompt(p)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center"
                >
                  Result
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* 📋 Copy Icon (Rightmost) */}
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

      {/* 🔢 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* 🪪 Popup Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 relative animate-fadeIn">
            <button
              onClick={() => setSelectedPrompt(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {selectedPrompt.title}
            </h2>
            <p className="text-blue-600 italic text-center mb-4">
              Category: {selectedPrompt.category}
            </p>

            <p className="text-gray-700 text-center mb-4">
              {selectedPrompt.description}
            </p>

            {/* Result Output */}
            {selectedPrompt.resultOutput && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-5">
                <h3 className="text-sm font-semibold text-blue-700 text-center">
                  Result Output
                </h3>
                <p className="text-gray-700 text-center">
                  {selectedPrompt.resultOutput}
                </p>
              </div>
            )}

            {/* Image */}
            {selectedPrompt.image && (
              <div className="mt-4">
                <img
                  src={`http://localhost:5000${selectedPrompt.image}`}
                  alt="Result"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Certificate */}
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5 mt-4 shadow-inner">
              <h3 className="text-lg font-semibold text-blue-700 text-center mb-2">
                🪪 Authorized Person
              </h3>
              <div className="text-gray-700 space-y-2 text-center">
                <p className="font-medium text-gray-800">
                  Authorized Certificate:
                </p>
                {selectedPrompt.certificate && (
                  <div className="mt-2">
                    <img
                      src={`http://localhost:5000${selectedPrompt.certificate}`}
                      alt="Authorized Certificate"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                )}
                <p>
                  Authorization (Email):{" "}
                  <span className="text-blue-700 font-semibold">
                    {selectedPrompt.email || "test4@gmail.com"}
                  </span>
                </p>
                <p>
                  Created At:{" "}
                  <span className="text-gray-600 italic">
                    {selectedPrompt.createdAt
                      ? new Date(selectedPrompt.createdAt).toLocaleTimeString()
                      : "12:25:14 am"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Copied Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-md animate-fadeInOut z-50">
          Copied!
        </div>
      )}

      {/* ✨ Animations */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(20px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeInOut { animation: fadeInOut 1.2s ease-in-out forwards; }
          .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
        `}
      </style>
    </div>
  );
}
