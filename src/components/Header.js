import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletService from '../services/WalletService';
import '../styles/header.css';

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false); // Стан для управління відкриттям меню

    const userRole = user ? user.role : null; 
    console.log(userRole);

    const updateUserData = () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchWalletData(storedUser.id);
        }
    };

    useEffect(() => {
        updateUserData();

        // Додаємо слухача події
        window.addEventListener('userLoggedIn', updateUserData);

        // Видаляємо слухача при розмонтуванні компонента
        return () => {
            window.removeEventListener('userLoggedIn', updateUserData);
        };
    }, []);

    const fetchWalletData = async (userId) => {
        try {
            const walletData = await WalletService.getWalletByUserId(userId);
            setWallet(walletData);
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
        }
    };

    const logout = () => {
        setUser(null);
        setWallet(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('wallet');
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="header-title" onClick={() => navigate('/')}>Flight Search</h1>
            </div>

            <div className="header-right">
                {user && (
                    <div className="user-info-container">
                        <span className="user-info" tabIndex={0}>{user.username}</span>
                        <button className="btn btn-flights" onClick={() => navigate('/reservation')}>My Flights</button>
                        {userRole === 'ADMIN' && (
                            <button className="btn btn-flights" onClick={() => navigate('/admin')}>
                                Admin
                            </button>
                        )}
                        <button className="btn btn-menu" onClick={() => setMenuOpen(!menuOpen)}>
                            Menu
                        </button>

                        {menuOpen && (
                            <div className="menu-dropdown">
                                <span className="welcome-message">Welcome, {user.username}!</span>
                                <span className="user-money">Balance: {wallet ? wallet.euro : 'Loading...'}</span>
                                <button className="btn btn-dropdown" onClick={() => navigate('/replenishment')}>Add money</button>
                                {/* <button className="btn btn-dropdown" onClick={() => navigate('/settings')}>Settings</button> */}
                                <button className="btn btn-dropdown" onClick={() => navigate('/username')}>Update Username</button>
                                <button className="btn btn-dropdown" onClick={() => navigate('/password')}>Change Password</button>
                                <button className="btn btn-danger" onClick={logout}>Logout</button>
                            </div>
                        )}
                    </div>
                )}

                {!user && (
                    <>
                        <button className="btn btn-action" onClick={() => navigate('/login')}>Login</button>
                        <button className="btn btn-action" onClick={() => navigate('/register')}>Register</button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
