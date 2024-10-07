// UpdateUsernamePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService'; // Імпортуємо UserService
import UpdateUsernameForm from '../components/UpdateUsernameForm'; // Імпортуємо форму

const UpdateUsernamePage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleUpdate = async (userId, username) => {
        try {
            await UserService.updateUsername(userId, username);
            navigate('/'); 
        } catch (error) {
            setError('Error updating username');
            console.error('Error:', error);
        }
    };

    return (
        <div className="update-username-page">
            {error && <p className="error">{error}</p>}
            <UpdateUsernameForm onUpdate={handleUpdate} />
        </div>
    );
};

export default UpdateUsernamePage;
