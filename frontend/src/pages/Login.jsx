import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { identifier, password });

        const { token } = response.data;
        localStorage.setItem('token', token);
        navigate('/dashboard');


    } catch (error) {
        console.error('Login error:', error);
        setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}> 
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Login</button>
        </form>

    </div>
  )
}

export default Login