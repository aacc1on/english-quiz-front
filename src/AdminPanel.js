import React, { useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [quizUrl, setQuizUrl] = useState("");
  const [results, setResults] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) setLoggedIn(true);
    else alert("Invalid credentials");
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/admin/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setQuizUrl(data.quizUrl);
  };

  const fetchResults = async () => {
    const res = await fetch(`${API}/api/admin/login`, {
      credentials: "include",
    });
    const data = await res.json();
    setResults(data.results);
  };

  if (!loggedIn) {
    return (
      <form onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (
    <div>
      <h2>Generate Quiz</h2>
      <form onSubmit={handleGenerateQuiz}>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text..." required />
        <button type="submit">Generate</button>
      </form>
      {quizUrl && <p>Quiz is ready at <a href={quizUrl}>Quiz Page</a></p>}
      <hr />
      <button onClick={fetchResults}>Show Results</button>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Surname</th><th>Score</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.surname}</td>
              <td>{r.score}</td>
              <td>{new Date(r.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}