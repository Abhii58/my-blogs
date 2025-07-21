import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode }from 'jwt-decode';
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Post from './pages/Post';
import CMS from './pages/CMS';
import Login from './pages/Login';
import Register from './pages/Registration';
import Header from './components/Header/Header';
import PrivateRoute from './components/PrivateRoute';
import './styles/GlobalStyles.css';

const App = () => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                return jwtDecode(token);
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
            }
        }
        return null;
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <Router>
            <div className="app">
                <Header onLogout={handleLogout} isAdmin={user?.role === 'admin'} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                 
                    <Route path="/post/:postId" element={<Post />} />
                    <Route 
                        path="/login" 
                        element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} 
                    />
                    <Route element={<PrivateRoute adminOnly={true} />}>
                        <Route path="/cms" element={<CMS />} />
                    </Route>
                    <Route 
                        path="/register" 
                        element={user ? <Navigate to="/" /> : <Register />} 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
