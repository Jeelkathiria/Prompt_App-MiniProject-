import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import AddPrompt from "./pages/AddPrompt";
import AllPrompts from "./pages/AllPrompts";
import Prompts from "./pages/Prompts"; // ✅ Added missing import
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* 🌐 Public Route */}
        <Route path="/" element={<Home />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/all-prompts"
          element={
            <ProtectedRoute>
              <AllPrompts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prompts/:category"
          element={
            <ProtectedRoute>
              <Prompts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute expertOnly>
              <AddPrompt />
            </ProtectedRoute>
          }
        />

        {/* 🧾 Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
