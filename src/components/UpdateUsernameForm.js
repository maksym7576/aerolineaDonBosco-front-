import React, { useState } from 'react';
import '../styles/UpdateUsernameForm.css'; // Імпортуємо CSS файл

const UpdateUsernameForm = ({ onUpdate }) => {
    const [username, setUsername] = useState('');
    const userId = localStorage.getItem('userId');

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(userId, username); // Викликаємо функцію оновлення
    };

    return (
        <form className="update-username-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>New Username:</label>
                <input
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <button className="form-button" type="submit">Update Username</button>
        </form>
    );
};

export default UpdateUsernameForm;
