import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService'; // Імпортуємо UserService
import '../styles/Login.css'; // Використовуємо ті ж стилі, що й для логіна

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Додаємо стан для електронної пошти
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Реєстрація користувача
            await AuthService.register({ username, email, password });
            // Логін після реєстрації
            await AuthService.login({ username, password });

            // Отримуємо профіль користувача
            const userProfile = await UserService.getUserProfile();
            localStorage.setItem('user', JSON.stringify(userProfile)); // Зберігаємо профіль користувача
            
            // Створюємо гаманець для користувача
            await UserService.createWalletForUser(userProfile.id);
            
            // Відправляємо подію про успішний вхід
            window.dispatchEvent(new Event('userLoggedIn'));

            navigate('/'); // Перенаправлення на головну сторінку
        } catch (error) {
            setError('Error during registration');
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="login-search-form">
            <h2 className="login-form-title">Register</h2>
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
                    <label className="login-form-subtitle">Email:</label>
                    <input
                        type="email" // Додаємо поле для електронної пошти
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" className="login-form-button">Register</button>
                {error && <p className="login-form-error">{error}</p>}
            </form>
        </div>
    );
}

export default Register;
