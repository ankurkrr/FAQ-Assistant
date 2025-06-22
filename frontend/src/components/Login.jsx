import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import '../styles/typing.css';

const API_URL = 'http://127.0.0.1:8080';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('username', formData.username);
      params.append('password', formData.password);

      const { data } = await axios.post(`${API_URL}/login`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      localStorage.setItem('token', data.access_token);
      setIsAuthenticated(true); // <-- This triggers App to re-render
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 px-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm text-white">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          <span className="typing-animation inline-block">Welcome to FAQ ASSISTANT</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-[#1E1E2F] border border-[#3B3B4F] text-white placeholder-gray-400 focus:outline-none"
            autoComplete="username"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-[#1E1E2F] border border-[#3B3B4F] text-white placeholder-gray-400 focus:outline-none"
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          {error && <div className="text-red-400 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
