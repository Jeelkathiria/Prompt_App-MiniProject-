import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // Listen to both actual storage changes and custom login/logout events
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleStorageChange);
    };
  }, []);

const handleLogout = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("authChange")); // 👈 also notify Navbar
  setIsLoggedIn(false);
  navigate("/");
};


  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold tracking-wide">
        <Link to="/">Prompt Collection</Link>
      </h1>

      <div className="space-x-6 flex items-center">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        {isLoggedIn && (
          <>
            <Link to="/categories" className="hover:underline">
              Categories
            </Link>
            <Link to="/add" className="hover:underline">
              Add Prompt
            </Link>
          </>
        )}

        <span className="h-6 w-px bg-white/40 mx-2"></span>

        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="px-3 py-1 rounded-md bg-white text-blue-600 font-medium hover:bg-blue-100 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 rounded-md border border-white hover:bg-white hover:text-blue-600 font-medium transition"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 transition font-medium"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
