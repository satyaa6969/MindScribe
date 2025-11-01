import React, { useState } from 'react';
import axios from 'axios';

// We'll pass a function to this component to call on successful login
const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Choose the correct API endpoint
        const endpoint = isRegister ? '/api/register/' : '/api/login/';

        // This is the URL of your Django backend
        const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

        try {
            const response = await axios.post(`${API_URL}${endpoint}`, {
                username,
                password
            });

            // If login/register is successful, call onLoginSuccess
            onLoginSuccess(response.data.token);

        } catch (err) {
            console.error('Error:', err);
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>{isRegister ? 'Register' : 'Login'}</h2>
                {error && <p className="error">{error}</p>}
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
            </form>
            <button onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Switch to Login' : 'Switch to Register'}
            </button>
        </div>
    );
};

export default Login;