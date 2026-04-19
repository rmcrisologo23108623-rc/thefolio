import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
        setIsDarkMode(!isDarkMode);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header>
            <div className="header-container">
                <div className="logo-container">
                    {!logoError ? (
                        <img 
                            src="https://png.pngtree.com/png-vector/20260323/ourlarge/pngtree-classic-volleyball-tournament-logo-with-shield-and-stars-png-image_18752667.webp" 
                            alt="TheFolio Logo" 
                            className="logo"
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <div className="logo" style={{ 
                            background: 'var(--accent)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'var(--primary)'
                        }}>
                            🏐
                        </div>
                    )}
                    <h1>Spike & Serve</h1>
                </div>
                <nav>
                    <ul>
                        <li><NavLink to="/" end>Home</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                        {user ? (
                            <>
                                <li><NavLink to="/create-post">New Post</NavLink></li>
                                <li><NavLink to="/profile">Profile</NavLink></li>
                                {user.role === 'admin' && (
                                    <li><NavLink to="/admin">Admin</NavLink></li>
                                )}
                                <li><button onClick={handleLogout}>Logout</button></li>
                                <li><span className="user-name">👤 {user.name}</span></li>
                            </>
                        ) : (
                            <>
                                <li><NavLink to="/login">Login</NavLink></li>
                                <li><NavLink to="/register">Register</NavLink></li>
                            </>
                        )}
                        <li className="theme-toggle">
                            <button onClick={toggleTheme} className="theme-toggle-btn">
                                {isDarkMode ? '☀️' : '🌙'}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;