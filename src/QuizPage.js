import React, { useState, useEffect } from "react";
const API = process.env.REACT_APP_API_URL;

export default function QuizPage() {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('[FRONTEND] Loading quiz from:', `${API}/api/quiz`);
    
    fetch(`${API}/api/quiz`)
      .then(res => {
        console.log('[FRONTEND] Quiz response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('[FRONTEND] Quiz data received:', data);
        setQuiz(data.quiz || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('[FRONTEND] Error loading quiz:', err);
        setError(`Failed to load quiz: ${err.message}`);
        setLoading(false);
      });
  }, []);

  const handleAnswerChange = (idx, val) => {
    console.log(`[FRONTEND] Answer changed - Question ${idx + 1}: ${val}`);
    setAnswers(a => ({ ...a, [idx]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !surname.trim()) {
      alert("Name and surname required");
      return;
    }

    // Check if all questions are answered
    const unanswered = quiz.findIndex((_, i) => !answers[i]);
    if (unanswered !== -1) {
      alert(`Please answer question ${unanswered + 1}`);
      return;
    }

    setSubmitting(true);
    console.log('[FRONTEND] Submitting quiz with:', {
      name,
      surname,
      answers: quiz.map((q, i) => answers[i])
    });

    try {
      const res = await fetch(`${API}/api/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          surname,
          answers: quiz.map((q, i) => answers[i])
        }),
      });

      console.log('[FRONTEND] Submit response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('[FRONTEND] Submit response data:', data);
      setScore(data.score);
    } catch (err) {
      console.error('[FRONTEND] Error submitting quiz:', err);
      alert(`Failed to submit quiz: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="main-container">
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!quiz.length) {
    return (
      <div className="main-container">
        <h2>No Quiz Available</h2>
        <p>Please ask the administrator to create a quiz first.</p>
        <p>Admin panel: <a href="/admin">Click here</a></p>
      </div>
    );
  }

  if (score !== null) {
    const percentage = Math.round((score / quiz.length) * 100);
    const message = percentage >= 70 ? "Great job!" : percentage >= 50 ? "Good effort!" : "Keep studying!";
    
    return (
      <div className="main-container">
        <h2>Quiz Completed!</h2>
        <div className="quiz-result">
          <p className="score">Your score: <strong>{score} / {quiz.length}</strong></p>
          <p className="percentage">Percentage: <strong>{percentage}%</strong></p>
          <p className={percentage >= 70 ? "success" : ""}>{message}</p>
          <button onClick={() => window.location.reload()}>Take Quiz Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <form onSubmit={handleSubmit}>
        <h2>English Vocabulary Quiz</h2>
        <p>Please answer all questions and submit your results.</p>
        
        <div className="user-info">
          <input 
            placeholder="First Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
          <input 
            placeholder="Last Name" 
            value={surname} 
            onChange={e => setSurname(e.target.value)} 
            required 
          />
        </div>

        {quiz.map((q, i) => (
          <div key={i} className="quiz-question">
            <h3>Question {i + 1}</h3>
            <p><strong>{q.question}</strong></p>
            <div className="options">
              {q.options.map(opt => (
                <label key={opt} className="option-label">
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={opt}
                    checked={answers[i] === opt}
                    onChange={() => handleAnswerChange(i, opt)}
                    required
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button 
          type="submit" 
          disabled={submitting}
          className={submitting ? "submitting" : ""}
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </form>
    </div>
  );
}