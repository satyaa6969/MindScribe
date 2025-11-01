import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; // <-- Import Dashboard
import './App.css';

function App() {
    // Check localStorage first
    const [token, setToken] = useState(localStorage.getItem('mindscribe-token'));

    useEffect(() => {
        // Sync token to localStorage
        if (token) {
            localStorage.setItem('mindscribe-token', token);
        } else {
            localStorage.removeItem('mindscribe-token');
        }
    }, [token]);

    const handleLogin = (newToken) => {
        setToken(newToken);
    };

    const handleLogout = () => {
        setToken(null);
    };

    // If we don't have a token, show the Login component
    if (!token) {
        return (
            <div className="login-page-wrapper">
                <div className="login-branding">
                    <img src="/logo.svg" alt="MindScribe Logo" />
                    <h1>MindScribe</h1>
                </div>
                <Login onLoginSuccess={handleLogin} />
            </div>
        );
    }

    // If we DO have a token, show the real Dashboard
    return (
        <div className="App">
            <header className="app-header">
                <h1>MindScribe Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </header>
            <main>
                <Dashboard token={token} />
            </main>
        </div>
    );
}

export default App;