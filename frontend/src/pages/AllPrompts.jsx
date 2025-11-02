import React, { useEffect, useState } from "react";
import { getAllPrompts } from "../api";
import {
  Clipboard,
  Check,
  X,
  Loader2,
  Search,
  ExternalLink,
} from "lucide-react";

export default function AllPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [search, setSearch] = useState("");

  const promptsPerPage = 16;

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await getAllPrompts();
        setPrompts(data);
      } catch {
        setError("Failed to load prompts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const filteredPrompts = prompts.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );

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

      {/* 🔍 Search Bar */}
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

      {/* 🧩 Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <p className="text-center text-gray-600">No prompts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPrompts.map((prompt) => (
            <div
              key={prompt._id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 hover:shadow-lg transition relative border border-gray-100 flex flex-col justify-between"
            >
              <div
                onClick={() => setSelectedPrompt(prompt)}
                className="cursor-pointer"
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
              </div>

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

              {/* 🔗 Result Link */}
              <button
                onClick={() => setSelectedPrompt(prompt)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-end mt-3"
              >
                Result <ExternalLink className="ml-1 w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🔄 Pagination */}
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

      {/* 🪄 Popup (Full Details) */}
      {selectedPrompt && (
        <div
          className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPrompt(null);
          }}
        ></div>
      )}

      {/* 🪄 Popup (Full Details) */}
      {selectedPrompt && (
        <div
          className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPrompt(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedPrompt(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* --- Basic Info --- */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedPrompt.title || "Untitled"}
            </h2>
            <p className="text-blue-700 text-sm font-medium mb-4">
              Category: {selectedPrompt.category || "Uncategorized"}
            </p>

            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Description:</strong>{" "}
              {selectedPrompt.description || "No description provided."}
            </p>

            {selectedPrompt.resultOutput && (
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>Result Output:</strong>{" "}
                {selectedPrompt.resultOutput || "N/A"}
              </p>
            )}

            {selectedPrompt.image && (
              <div className="my-3">
                <img
                  src={`http://localhost:5000${selectedPrompt.image}`}
                  alt="Result"
                  className="w-full rounded-xl shadow-md"
                />
              </div>
            )}

            {/* --- Authorized Section --- */}
            <div className="border-t border-gray-300 mt-6 pt-5 text-sm text-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span role="img" aria-label="id">
                  🪪
                </span>{" "}
                Authorized Person
              </h3>


              {/* Authorized Certificate */}
              {selectedPrompt.certificate && (
                <div className="my-3">
                  <p className="font-medium mb-1">Authorized Certificate:</p>
                  <img
                    src={`http://localhost:5000${selectedPrompt.certificate}`}
                    alt="Authorized Certificate"
                    className="rounded-lg shadow-md w-full"
                  />
                </div>
              )}

              {/* Authorization Email */}
              <p className="mb-2">
                <strong>Authorization (Email):</strong>{" "}
                {selectedPrompt.createdBy || "Unknown"}
              </p>


              <p>
                <strong>Created At:</strong>{" "}
                {selectedPrompt.createdAt
                  ? new Date(selectedPrompt.createdAt).toLocaleTimeString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      )}

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
