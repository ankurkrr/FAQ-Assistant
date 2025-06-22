import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8080';

const Dashboard = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await axios.post(
        `${API_URL}/ask`,
        { question: query },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAnswer(res.data.answer);
    } catch {
      setAnswer('Error: Could not get answer.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Hamburger */}
      <div className="absolute top-4 left-4 z-10">
        <button
          className="text-white text-3xl focus:outline-none"
          onClick={() => setShowMenu(!showMenu)}
        >
          &#9776;
        </button>
        {showMenu && (
          <div className="mt-2 bg-white rounded shadow-lg">
            <button
              className="block px-4 py-2 text-black hover:bg-gray-200 w-full text-left"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {/* Chatbot UI */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-[#18181b] rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center">
          <div className="w-full min-h-[120px] bg-[#23232a] rounded-lg mb-6 p-4 text-white text-lg flex items-center justify-center">
            {loading ? <span className="animate-pulse">Thinking...</span> : answer || 'Ask me anything about the FAQ!'}
          </div>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type your question..."
            className="w-full mb-4 px-4 py-2 rounded-lg bg-[#1E1E2F] border border-[#3B3B4F] text-white placeholder-gray-400 focus:outline-none"
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
          />
          <button
            onClick={handleAsk}
            className="w-full py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
            disabled={loading}
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;