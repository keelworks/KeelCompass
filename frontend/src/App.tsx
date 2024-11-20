import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import QnA from "./pages/QnA";
import Search from "./pages/Search";
import "./App.css";

function App() {
  return (
    <Router>
      {/* Main Content */}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/qna" element={<QnA />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
