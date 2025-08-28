import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Prompts from "./pages/Prompts";
import AddPrompt from "./pages/AddPrompt";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/prompts/:category" element={<Prompts />} />
        <Route path="/add" element={<AddPrompt />} />
      </Routes>
    </Router>
  );
}
