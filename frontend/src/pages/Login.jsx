import React from 'react'
import { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await axiosInstance.post('/auth/login', { identifier, password });

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        navigate('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Notable</h2>
          <p className="login-subtitle">Sign in to access your notes</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}> 
          <div className="form-group">
            <label htmlFor="identifier">Email or Username</label>
            <input
              type="text"
              id="identifier"
              className="form-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="login-footer">
          Don't have an account? <Link to="/register">Create one here</Link>
        </div>
      </div>
    </div>
  )
}

export default Login