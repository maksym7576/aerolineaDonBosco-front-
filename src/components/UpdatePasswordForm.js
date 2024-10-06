// UpdatePasswordForm.js
import React, { useState } from 'react';

const UpdatePasswordForm = ({ onUpdate }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const userId = localStorage.getItem('userId');

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(userId, oldPassword, newPassword); // Викликаємо функцію оновлення
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Old Password:</label>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>New Password:</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Update Password</button>
        </form>
    );
};

export default UpdatePasswordForm;
