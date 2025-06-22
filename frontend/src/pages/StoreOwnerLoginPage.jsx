import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './LoginPage.css';

const StoreOwnerLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/store/dashboard');
        }
    }, [user, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">Store Owner Login</h1>
                <form onSubmit={submitHandler} className="login-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p>New Store Owner? <Link to="/signup/store">Create an account</Link></p>
                <hr />
                <p>Login as a <Link to="/login/user">User</Link> or <Link to="/login/admin">Admin</Link></p>
            </div>
        </div>
    );
};

export default StoreOwnerLoginPage; 