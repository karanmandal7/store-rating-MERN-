import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Header.css';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (!user) return null;
        switch (user.role) {
            case 'Admin':
                return <Link to="/admin/dashboard">Admin Dashboard</Link>;
            case 'Store Owner':
                return <Link to="/store/dashboard">My Dashboard</Link>;
            case 'Normal User':
                return <Link to="/stores">View All Stores</Link>;
            default:
                return null;
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">StoreRating</Link>
                <nav className="header-nav">
                    {user ? (
                        <>
                            {getDashboardLink()}
                            {user.role === 'Normal User' && <Link to="/change-password">Change Password</Link>}
                            {user.role === 'Store Owner' && <Link to="/change-password">Change Password</Link>}
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </>
                    ) : (
                        <Link to="/">Login/Register</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header; 