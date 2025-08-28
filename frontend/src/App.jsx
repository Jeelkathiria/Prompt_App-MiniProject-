import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Prompts from "./pages/Prompts";
import AddPrompt from "./pages/AddPrompt";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar always visible */}
        <Navbar />

        {/* Main Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/prompts/:category" element={<Prompts />} />
          <Route path="/add" element={<AddPrompt />} />
        </Routes>
      </div>
    </Router>
  );
}
