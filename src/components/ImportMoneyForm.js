import React, { useState } from 'react';
import WalletService from '../services/WalletService';

const ImportMoneyForm = ({ wallet }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Перевірка на валідність суми
        if (amount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        try {
            // Отримання userId з localStorage
            const userId = localStorage.getItem('userId');
            // Виконання запиту на додавання грошей до гаманця
            const response = await WalletService.addMoneyToWallet(userId, amount);

            console.log('Money added successfully:', response);
            setAmount(''); // Очистка поля після успішного запиту
            setError(''); // Очистка помилки (якщо була)
        } catch (err) {
            setError('Failed to add money to wallet.');
            console.error('Error response:', err.response); // Логування помилки
        }
    };

    return (
        <form className="ImportMoney-form" onSubmit={handleSubmit}>
            <div className="ImportMoney-form-group">
                <label className="ImportMoney-form-subtitle">Current Balance:</label>
                <p>{wallet.euro} Euro</p>
            </div>
            <div className="ImportMoney-form-group">
                <input
                    type="number"
                    className="ImportMoney-form-input"
                    placeholder="Amount to add"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            {error && <p className="ImportMoney-form-error">{error}</p>}
            <button type="submit" className="ImportMoney-form-button">Add Money</button>
        </form>
    );
};

export default ImportMoneyForm;
