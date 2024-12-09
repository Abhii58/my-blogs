import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import { UserContext } from '../../contexts/UserContext';
import '../layout.css';
import '../../styles/variables.css';

const Header = ({ onLogout }) => {
    const { user } = useContext(UserContext);
    const isAdmin = user?.role === 'admin';

    const toggleTheme = () => {
        const body = document.body;
        body.classList.toggle('dark-theme');
    };

    return (
        <header className="header">
            <h1>Blog.ab</h1>
            
           {/*   <SearchBar onSearch={null} />Add your search handler here */}
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    {isAdmin && <li><Link to="/cms">CMS</Link></li>} {/* Conditionally render CMS link */}
                    {user ? (
                        <li><Link to="/" onClick={onLogout}>Logout</Link></li>
                    ) : (
                        <li><Link to="/login">Login</Link></li>
                    )}
                   {/* <li>
                        <button onClick={toggleTheme} className="theme-toggle">
                            🌓 
                        </button>
                    </li>*/} 
                </ul>
            </nav>
        </header>
    );
};

export default Header;
