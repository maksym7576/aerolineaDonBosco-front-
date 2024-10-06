import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import WalletService from '../services/WalletService';
import '../styles/Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await AuthService.login({ username, password });
            const userProfile = await AuthService.getUserProfile();
            localStorage.setItem('user', JSON.stringify(userProfile));

            const walletData = await WalletService.getWalletByUserId(userProfile.id);
            localStorage.setItem('wallet', JSON.stringify(walletData));

            // Відправляємо подію про успішний вхід
            window.dispatchEvent(new Event('userLoggedIn'));

            navigate('/');
        } catch (error) {
            setError('Invalid username or password');
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="login-search-form">
            <h2 className="login-form-title">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="login-form-group">
                    <label className="login-form-subtitle">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="login-form-input"
                    />
                </div>
                <div className="login-form-group">
                    <label className="login-form-subtitle">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-form-input"
                    />
                </div>
                <button type="submit" className="login-form-button">Login</button>
                {error && <p className="login-form-error">{error}</p>}
            </form>
        </div>
    );
}

export default Login;