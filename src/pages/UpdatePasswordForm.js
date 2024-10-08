// UpdatePasswordPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService'; 
import UpdatePasswordForm from '../components/UpdatePasswordForm'; 

const UpdatePasswordPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleUpdate = async (userId, oldPassword, newPassword) => {
        try {
            await UserService.updatePassword(userId, oldPassword, newPassword);
            navigate('/'); 
        } catch (error) {
            setError('Error updating password');
            console.error('Error:', error);
        }
    };

    return (
        <div className="update-password-page">
            {error && <p className="error">{error}</p>}
            <UpdatePasswordForm onUpdate={handleUpdate} />
        </div>
    );
};

export default UpdatePasswordPage;
