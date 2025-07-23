import React, { useState, useEffect } from "react";
const API = process.env.REACT_APP_API_URL;

export default function QuizPage() {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/quiz`)
      .then(res => res.json())
      .then(data => setQuiz(data.quiz || []));
  }, [API]); // ✅ dependency array fixed

  const handleAnswerChange = (idx, val) => {
    setAnswers(a => ({ ...a, [idx]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !surname.trim()) {
      alert("Name and surname required");
      return;
    }
    const res = await fetch(`${API}/api/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        surname,
        answers: quiz.map((q, i) => answers[i])
      }),
    });
    const data = await res.json();
    setScore(data.score);
  };

  if (!quiz.length) return <p>No quiz available.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Quiz</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Surname" value={surname} onChange={e => setSurname(e.target.value)} required />
      {quiz.map((q, i) => (
        <div key={i}>
          <p>{q.question}</p>
          {q.options.map(opt => (
            <label key={opt}>
              <input
                type="radio"
                name={`q${i}`}
                value={opt}
                checked={answers[i] === opt}
                onChange={() => handleAnswerChange(i, opt)}
                required
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button type="submit">Submit</button>
      {score !== null && <p>Your score: {score} / {quiz.length}</p>}
    </form>
  );
}