import React, { useState, useEffect } from 'react';
import WalletService from '../services/WalletService';
import ImportMoneyForm from '../components/ImportMoneyForm';
import '../styles/ImportMoneyStyles.css';

const ImportMoneyPage = () => {
    const [wallet, setWallet] = useState(null);
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const walletData = await WalletService.getWalletByUserId(userId);
                setWallet(walletData);
            } catch (error) {
                console.error('Failed to fetch wallet:', error);
            }
        };

        fetchWallet();
    }, [userId]);

    return (
        <div className="ImportMoney-container">
            <h2 className="ImportMoney-title">Import Money to Your Wallet</h2>
            {wallet && <ImportMoneyForm wallet={wallet} />}
        </div>
    );
};

export default ImportMoneyPage;
