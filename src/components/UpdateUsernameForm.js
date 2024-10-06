// UpdateUsernameForm.js
import React, { useState } from 'react';

const UpdateUsernameForm = ({ onUpdate }) => {
    const [username, setUsername] = useState('');
    const userId = localStorage.getItem('userId');

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(userId, username); // Викликаємо функцію оновлення
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>New Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Update Username</button>
        </form>
    );
};

export default UpdateUsernameForm;
