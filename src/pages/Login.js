import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode }from 'jwt-decode'; // Corrected import statement
import { UserContext } from '../contexts/UserContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [redirect, setRedirect] = useState(false); // Added redirect state
    const { user, login } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            const decodedToken = jwtDecode(token);
            localStorage.setItem('user', JSON.stringify(decodedToken));
            login(token);
            setRedirect(true);
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    useEffect(() => {
        if (redirect) {
            window.location.reload();
        }
    }, [redirect]);

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <div className="login">
            <form id="loginForm" onSubmit={handleSubmit}>
                <h2>Welcome Back</h2>
                <p>Please login to your account</p>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                />
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
                <p className='login-link'>Don't have an account? <Link to="/register">Register here</Link></p>
            </form>
            
         
                </div>
    );
};

export default Login;
