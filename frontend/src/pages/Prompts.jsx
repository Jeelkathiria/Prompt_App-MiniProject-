import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPrompts, getComments, addComment } from "../api";
import { Search, Clipboard, Check, X, MessageCircle } from "lucide-react";

export default function Prompts() {
  const { category } = useParams();

  // 🧠 State management
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [feedbackPrompt, setFeedbackPrompt] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedback, setFeedback] = useState({ author: "", text: "" });
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const promptsPerPage = 6;

  // 📥 Fetch prompts by category
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

  // 📋 Copy prompt text
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

  // 💬 Open feedback modal & fetch comments
  const openFeedbackPopup = async (prompt) => {
    setFeedbackPrompt(prompt);
    setLoadingComments(true);
    try {
      const data = await getComments(prompt._id);
      console.log("💬 Comments fetched:", data);
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
    setLoadingComments(false);
  };

  // 📝 Handle feedback submission
  const handleSubmitFeedback = async () => {
    if (!feedback.author || !feedback.text) {
      alert("All fields are required!");
      return;
    }

    try {
      await addComment(feedbackPrompt._id, feedback);
      setFeedback({ author: "", text: "" });
      const updated = await getComments(feedbackPrompt._id);
      setComments(updated);
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment");
    }
  };

  // 🔍 Filter prompts by search
  const filteredPrompts = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Pagination logic
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

              {/* Buttons */}
              <div className="absolute bottom-3 right-16 flex space-x-3">
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

                {/* 💬 Feedback Button */}
                <button
                  onClick={() => openFeedbackPopup(p)}
                  className="text-green-600 hover:text-green-800 text-sm font-semibold flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Feedback
                </button>
              </div>

              {/* 📋 Copy Icon */}
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

      {/* 🪪 Result Popup */}
      {/* 🪪 Enhanced Result Popup (like AllPrompts.jsx) */}
      {selectedPrompt && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPrompt(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative overflow-y-auto max-h-[90vh] animate-fadeIn">
            <button
              onClick={() => setSelectedPrompt(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title & Category */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedPrompt.title}
            </h2>
            <p className="text-blue-700 text-sm font-medium mb-4">
              Category: {selectedPrompt.category}
            </p>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Description:</strong> {selectedPrompt.description}
            </p>

            {/* Result Output */}
            {selectedPrompt.resultOutput && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <h3 className="text-sm font-semibold text-blue-700">
                  Result Output
                </h3>
                <p className="text-gray-700">{selectedPrompt.resultOutput}</p>
              </div>
            )}

            {/* Result Image */}
            {selectedPrompt.image && (
              <div className="my-4">
                <img
                  src={`http://localhost:5000${selectedPrompt.image}`}
                  alt="Result"
                  className="w-full rounded-xl shadow-md"
                />
              </div>
            )}

            {/* Certificate & Creator Info */}
            <div className="border-t mt-6 pt-5 text-sm text-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🪪 Authorized Person
              </h3>

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

              {selectedPrompt.createdBy && (
                <p className="mb-2">
                  <strong>Authorization (Email):</strong>{" "}
                  {selectedPrompt.createdBy}
                </p>
              )}

              {selectedPrompt.user?.name && (
                <p className="mb-2">
                  <strong>Created By - Name:</strong> {selectedPrompt.user.name}
                </p>
              )}
              {selectedPrompt.user?.email && (
                <p className="mb-2">
                  <strong>Created By - Email:</strong>{" "}
                  {selectedPrompt.user.email}
                </p>
              )}

              {selectedPrompt.createdAt && (
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedPrompt.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 💬 Feedback Modal */}
      {feedbackPrompt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[90%] max-w-lg p-6 shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setFeedbackPrompt(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-center text-gray-800 mb-3">
              Feedback for "{feedbackPrompt.title}"
            </h2>

            {/* Feedback Form */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={feedback.author}
                onChange={(e) =>
                  setFeedback({ ...feedback, author: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <textarea
                placeholder="Your Feedback"
                rows="3"
                value={feedback.text}
                onChange={(e) =>
                  setFeedback({ ...feedback, text: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <button
                onClick={handleSubmitFeedback}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
              >
                Submit Feedback
              </button>
            </div>

            {/* Previous Feedback */}
            <div className="mt-5">
              <h3 className="font-semibold text-gray-700 mb-2 text-center">
                Previous Feedback
              </h3>
              {loadingComments ? (
                <p className="text-gray-500 text-center">Loading...</p>
              ) : comments.length === 0 ? (
                <p className="text-gray-500 text-center">No feedback yet.</p>
              ) : (
                <ul className="max-h-40 overflow-y-auto space-y-2">
                  {comments.map((c) => (
                    <li
                      key={c._id}
                      className="border border-gray-200 p-2 rounded-md bg-gray-50"
                    >
                      <p className="font-medium text-gray-800">
                        {c.author || "Anonymous"}
                      </p>
                      <p className="text-gray-600 text-sm">{c.text}</p>
                    </li>
                  ))}
                </ul>
              )}
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
