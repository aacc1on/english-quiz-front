import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPanel from "./AdminPanel";
import QuizPage from "./QuizPage";
import "./App.css"; // Ավելացրեք այս տողը

function App() {
  return (
    <div className="main-container">
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/" element={<QuizPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
