import React, { useEffect, useState } from "react";
import { getAllPrompts } from "../api";
import { Clipboard, Check, X, Loader2, Search } from "lucide-react";

export default function AllPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [search, setSearch] = useState("");

  const promptsPerPage = 16; // ✅ 4x4 grid per page

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await getAllPrompts();
        setPrompts(data);
      } catch (err) {
        setError("Failed to load prompts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  // ✅ Filter logic
  const filteredPrompts = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Pagination
  const indexOfLast = currentPage * promptsPerPage;
  const indexOfFirst = indexOfLast - promptsPerPage;
  const currentPrompts = filteredPrompts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

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

  // ✅ Loader
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );

  // ✅ Error
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-medium">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 relative">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        All Prompts
      </h1>

      {/* ✅ Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-[60%]">
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full py-2.5 px-4 pr-10 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* ✅ Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <p className="text-center text-gray-600">No prompts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPrompts.map((prompt) => (
            <div
              key={prompt._id}
              onClick={() => setSelectedPrompt(prompt)}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 hover:shadow-lg transition cursor-pointer relative border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {prompt.title}
              </h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {prompt.description}
              </p>
              <p className="text-blue-600 text-xs font-medium">
                Category: {prompt.category || "Uncategorized"}
              </p>

              {/* ✅ Copy Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(prompt._id, prompt.description);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-blue-500 transition"
              >
                <div
                  className={`w-5 h-5 transition-transform duration-700 ${
                    copiedId === prompt._id ? "rotate-[360deg]" : "rotate-0"
                  }`}
                >
                  {copiedId === prompt._id ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clipboard className="w-5 h-5" />
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-800"
            } transition`}
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-800"
            } transition`}
          >
            Next
          </button>
        </div>
      )}

      {/* ✅ Popup */}
      {selectedPrompt && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-gray-200/90 via-gray-300/80 to-gray-400/70 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPrompt(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
            <button
              onClick={() => setSelectedPrompt(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedPrompt.title}
            </h2>
            <p className="text-blue-700 text-sm font-medium mb-3">
              Category: {selectedPrompt.category || "Uncategorized"}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {selectedPrompt.description}
            </p>
          </div>
        </div>
      )}

      {/* ✅ Copied Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-md animate-fadeInOut z-50">
          Copied!
        </div>
      )}

      {/* ✅ Animations */}
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
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
