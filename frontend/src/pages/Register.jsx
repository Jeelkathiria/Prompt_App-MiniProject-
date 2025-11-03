import React, { useState, useEffect } from "react";
import { registerUser, getCategories } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Info } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    field: "",
    newField: "",
    certificate: null,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [upiID, setUpiID] = useState("");
  const [bank, setBank] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Handle registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentDone) {
      setError("Please complete payment before registering.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("field", form.field);
      formData.append("newField", form.newField);
      if (form.certificate) formData.append("certificate", form.certificate);

      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError("User already exists or invalid data");
    }
  };

  // ✅ Handle payment
  const handlePayment = (e) => {
    e.preventDefault();
    if (!upiID.trim()) {
      setPaymentStatus("Please enter a valid UPI ID.");
      setPaymentDone(false);
      return;
    }
    setPaymentStatus("Payment successful! Receipt will be mailed after generation.");
    setPaymentDone(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 flex justify-center items-center gap-2">
          <UserPlus className="w-6 h-6 text-blue-600" /> Register
        </h1>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Field of Expertise */}
          <select
            value={form.field}
            onChange={(e) => setForm({ ...form, field: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select Field of Expertise</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {/* If Other selected */}
          {form.field === "Other" && (
            <input
              type="text"
              placeholder="Enter your field name"
              value={form.newField}
              onChange={(e) => setForm({ ...form, newField: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          )}

          {/* Certificate Upload */}
          <div className="relative">
            <label className="block text-gray-700 mb-1 flex items-center gap-2">
              <span>Attach Certificate</span>
              <div
                className="relative"
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
              >
                <Info className="w-4 h-4 text-blue-600 cursor-pointer" />
                {showInfo && (
                  <div className="absolute top-6 left-0 bg-gray-800 text-white text-xs rounded-md px-3 py-2 shadow-lg w-64 z-10">
                    Upload your professional certificate.
                  </div>
                )}
              </div>
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setForm({ ...form, certificate: e.target.files[0] })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
            />
          </div>

          {/* Register Button - disabled until payment is done */}
          <button
            type="submit"
            disabled={!paymentDone}
            className={`w-full py-2 rounded-lg transition ${
              paymentDone
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Register
          </button>
        </form>

        {/* Payment Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
            Registration Fee: ₹500
          </h2>

          <form onSubmit={handlePayment} className="space-y-3">
            <input
              type="text"
              placeholder="Enter UPI ID (e.g. name@upi)"
              value={upiID}
              onChange={(e) => setUpiID(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />

            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Select Bank</option>
              <option value="SBI">State Bank of India</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="Axis">Axis Bank</option>
              <option value="PNB">Punjab National Bank</option>
            </select>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Pay Now
            </button>
          </form>

          {paymentStatus && (
            <p
              className={`mt-3 text-center text-sm ${
                paymentStatus.includes("successful")
                  ? "text-green-600 font-semibold"
                  : "text-red-500"
              }`}
            >
              {paymentStatus}
            </p>
          )}
        </div>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}