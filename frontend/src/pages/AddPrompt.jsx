import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCategories } from "../api";
import { jwtDecode } from "jwt-decode";


export default function AddPrompt() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    resultOutput: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [expertField, setExpertField] = useState("");

  useEffect(() => {
    async function initData() {
      try {
        const data = await getCategories();
        const names = Array.isArray(data) ? data.map((c) => c.name) : [];
        setCategories(names);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            if (decoded?.field) {
              setExpertField(decoded.field);
              setForm((prev) => ({ ...prev, category: decoded.field }));
            }
          } catch (decodeErr) {
            console.warn("Invalid token:", decodeErr);
            localStorage.removeItem("token");
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching:", err);
        setLoading(false);
      }
    }
    initData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // clear error on change
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.resultOutput.trim()) newErrors.resultOutput = "Result output is required";
    if (!form.image) newErrors.image = "Image is required";
    if (!expertField) newErrors.category = "Your expert field was not found";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setErrors({ auth: "Please log in first" });
      return;
    }

    const normalized = expertField.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const found = categories.some(
      (cat) => cat.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() === normalized
    );
    if (!found) {
      setErrors({ category: "Your expert field is not a valid category" });
      return;
    }

    const formData = new FormData();
    Object.entries({
      title: form.title,
      category: expertField,
      description: form.description,
      resultOutput: form.resultOutput,
    }).forEach(([key, value]) => formData.append(key, value));
    form.image && formData.append("image", form.image);

    try {
      const res = await axios.post("http://localhost:5000/api/prompts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Added:", res.data);
      setSuccess(true);
      setForm({
        title: "",
        category: expertField,
        description: "",
        resultOutput: "",
        image: null,
      });
      setErrors({});
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error("Prompt add error:", err.response || err.message);
      setErrors({ server: err.response?.data?.error || "Failed to add prompt" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg animate-pulse">
          Fetching categories...
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-lg backdrop-blur-lg bg-white/60 border border-gray-200 rounded-2xl shadow-lg p-8 transition-transform hover:scale-[1.01]">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          🧠 Add a New Prompt
        </h1>

        {success && (
          <div className="bg-green-100 border border-green-300 text-green-700 text-center p-2 mb-4 rounded-md">
            ✅ Prompt added successfully!
          </div>
        )}
        {errors.server && (
          <div className="bg-red-100 border border-red-300 text-red-700 text-center p-2 mb-4 rounded-md">
            ❌ {errors.server}
          </div>
        )}

        {expertField && (
          <p className="text-center text-sm text-gray-600 mb-4">
            <strong>Your expert field:</strong> {expertField}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-left font-semibold mb-1 text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter your prompt title"
              className={`w-full border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-left font-semibold mb-1 text-gray-700">
              Category (Locked)
            </label>
            <input
              type="text"
              name="category"
              value={expertField}
              readOnly
              className={`w-full border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2.5 bg-gray-100 text-gray-600 cursor-not-allowed`}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-left font-semibold mb-1 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the prompt idea..."
              className={`w-full border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Result Output */}
          <div>
            <label className="block text-left font-semibold mb-1 text-gray-700">
              Result Output
            </label>
            <textarea
              name="resultOutput"
              value={form.resultOutput}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the outcome or result achieved..."
              className={`w-full border ${
                errors.resultOutput ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none`}
            />
            {errors.resultOutput && (
              <p className="text-red-500 text-sm mt-1">{errors.resultOutput}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-left font-semibold mb-1 text-gray-700">
              Upload Result Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full border ${
                errors.image ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none`}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-[2px]"
          >
            Add Prompt
          </button>
        </form>
      </div>
    </div>
  );
}
