import React, { useState } from 'react';
import WalletService from '../services/WalletService';

const ImportMoneyForm = ({ wallet }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (amount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            const response = await WalletService.addMoneyToWallet(userId, amount);

            console.log('Money added successfully:', response);
            setAmount(''); 
            setError(''); 
        } catch (err) {
            setError('Failed to add money to wallet.');
            console.error('Error response:', err.response);
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
