import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './Register.css'
import axiosInstance from '../api/axios'

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        
        if (!username || !password || !email) {
            setError('Please fill in all fields')
            setLoading(false)
            return
        }
        
        try {
            const response = await axiosInstance.post('/api/auth/register', { 
                username, 
                password, 
                email 
            })
            
            setSuccess('Registration successful! Redirecting to login...')
            
            // Redirect after showing success message
            setTimeout(() => {
                navigate('/login')
            }, 2000)

        } catch (err) {
            console.error('Registration error:', err)
            setError(err.response?.data?.error || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>Notable</h2>
                    <p className="register-subtitle">Create your account to start taking notes</p>
                </div>
                
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">   
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="form-input"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                </form>

                <div className="register-footer">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    )
}

export default Register