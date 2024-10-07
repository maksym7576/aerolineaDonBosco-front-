import React, { useState } from 'react';
import '../styles/UpdatePasswordForm.css'; // Імпортуємо CSS файл

const UpdatePasswordForm = ({ onUpdate }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const userId = localStorage.getItem('userId');

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(userId, oldPassword, newPassword); // Викликаємо функцію оновлення
    };

    return (
        <form className="update-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Old Password:</label>
                <input
                    className="form-input"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>New Password:</label>
                <input
                    className="form-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>
            <button className="form-button" type="submit">Update Password</button>
        </form>
    );
};

export default UpdatePasswordForm;
