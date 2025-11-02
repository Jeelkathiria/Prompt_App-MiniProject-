// frontend/src/pages/AllPrompts.jsx
import React, { useEffect, useState } from "react";
import { getPrompts, getComments, addComment } from "../api";
import {
  Clipboard,
  Check,
  X,
  Loader2,
  Search,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

export default function AllPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Modals
  const [selectedPrompt, setSelectedPrompt] = useState(null); // for result modal
  const [feedbackPrompt, setFeedbackPrompt] = useState(null); // for feedback modal

  // Comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Search & pagination
  const [search, setSearch] = useState("");
  const promptsPerPage = 16;

  // -----------------------------------
  // 🧩 Load Prompts
  // -----------------------------------
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await getPrompts();
        setPrompts(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load prompts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  // -----------------------------------
  // 🔍 Search & Pagination
  // -----------------------------------
  const filteredPrompts = prompts.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPrompts.length / promptsPerPage)
  );
  const indexOfLast = currentPage * promptsPerPage;
  const indexOfFirst = indexOfLast - promptsPerPage;
  const currentPrompts = filteredPrompts.slice(indexOfFirst, indexOfLast);

  // -----------------------------------
  // 📋 Copy Description
  // -----------------------------------
  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopiedId(id);
      setShowToast(true);
      setTimeout(() => setCopiedId(null), 1400);
      setTimeout(() => setShowToast(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // -----------------------------------
  // 💬 Open Feedback Popup + Load Comments
  // -----------------------------------
  const openFeedbackPopup = async (prompt) => {
    setFeedbackPrompt(prompt);
    setComments([]);
    try {
      const data = await getComments(prompt._id);
      setComments(data || []);
    } catch (err) {
      console.error("Failed to load comments", err);
      setComments([]);
    }
  };

  // -----------------------------------
  // 💬 Add a Comment
  // -----------------------------------
  const handleAddComment = async () => {
    if (!userName.trim() || !newComment.trim()) return;
    setSubmitting(true);
    try {
      const commentData = { author: userName.trim(), text: newComment.trim() };
      const newCmt = await addComment(feedbackPrompt._id, commentData);
      setComments((prev) => [newCmt, ...prev]); // instantly show new comment
      setNewComment("");
      setUserName("");
    } catch (err) {
      console.error("Add comment failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------------
  // 🌀 Loading / Error States
  // -----------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-medium">
        {error}
      </div>
    );
  }

  // -----------------------------------
  // 🎨 UI Layout
  // -----------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 relative">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        All Prompts
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-[60%]">
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-gray-300 rounded-full py-2.5 px-4 pr-10 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Prompts Grid */}
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

              {/* Copy Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(prompt._id, prompt.description);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-blue-500 transition"
                title="Copy description"
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

              {/* Bottom Buttons */}
              <div className="flex justify-between mt-3 text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPrompt(prompt);
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Result <ExternalLink className="ml-1 w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openFeedbackPopup(prompt);
                  }}
                  className="text-green-600 hover:text-green-800 flex items-center"
                >
                  Feedback <MessageSquare className="ml-1 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ----- Result Modal ----- */}
      {selectedPrompt && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPrompt(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedPrompt(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedPrompt.title}
            </h2>
            <p className="text-blue-700 text-sm font-medium mb-4">
              Category: {selectedPrompt.category}
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Description:</strong> {selectedPrompt.description}
            </p>

            {selectedPrompt.resultOutput && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <h3 className="text-sm font-semibold text-blue-700">
                  Result Output
                </h3>
                <p className="text-gray-700">{selectedPrompt.resultOutput}</p>
              </div>
            )}

            {selectedPrompt.image && (
              <div className="my-4">
                <img
                  src={`http://localhost:5000${selectedPrompt.image}`}
                  alt="Result"
                  className="w-full rounded-xl shadow-md"
                />
              </div>
            )}

            {/* Authorized Info */}
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

              <p className="mb-2">
                <strong>Authorization (Email):</strong>{" "}
                {selectedPrompt.createdBy || "Unknown"}
              </p>

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

              <p>
                <strong>Created At:</strong>{" "}
                {selectedPrompt.createdAt
                  ? new Date(selectedPrompt.createdAt).toLocaleString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----- Feedback Modal ----- */}
      {feedbackPrompt && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFeedbackPrompt(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 relative flex flex-col max-h-[80vh]">
            <button
              onClick={() => setFeedbackPrompt(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-2">
              Feedback • {feedbackPrompt.title}
            </h3>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-3 py-2 border-t border-gray-200">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No feedback yet — be the first to comment.
                </p>
              ) : (
                comments.map((c, i) => (
                  <div key={i} className="bg-gray-50 p-2 rounded-md">
                    <div className="flex justify-between items-baseline">
                      <div className="text-sm font-semibold text-gray-800">
                        {c.author}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            <div className="mt-3 border-t pt-3">
              <input
                type="text"
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border rounded px-2 py-2 text-sm mb-2"
              />
              <textarea
                rows="3"
                placeholder="Add your feedback..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border rounded px-2 py-2 text-sm"
              />
              <button
                onClick={handleAddComment}
                disabled={submitting}
                className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                {submitting ? "Posting..." : "Post Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-md z-50">
          Copied!
        </div>
      )}
    </div>
  );
}
