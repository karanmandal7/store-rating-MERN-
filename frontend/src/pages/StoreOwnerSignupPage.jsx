import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './SignupPage.css';

const StoreOwnerSignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState({});
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/store/dashboard');
        }
    }, [user, navigate]);

    const validate = () => {
        const newErrors = {};
        if (name.length < 8 || name.length > 60) newErrors.name = 'Name must be between 8 and 60 characters.';
        if (address.length > 400) newErrors.address = 'Address cannot exceed 400 characters.';
        if (password.length < 8 || password.length > 16) newErrors.password = 'Password must be between 8 and 16 characters.';
        else if (!/^(?=.*[A-Z])(?=.*[!@#$&*])/.test(password)) newErrors.password = 'Password must contain at least one uppercase letter and one special character.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            await axios.post('/api/auth/register', { 
                name, 
                email, 
                password, 
                address, 
                role: 'Store Owner' 
            });
            await login(email, password);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            alert(errorMessage);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h1 className="signup-title">Store Owner Signup</h1>
                <form onSubmit={submitHandler} className="signup-form" noValidate>
                    <div className="form-group">
                        <label>Store Owner Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        {errors.name && <p className="error-message">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>
                    <div className="form-group">
                        <label>Business Address</label>
                        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="3"></textarea>
                        {errors.address && <p className="error-message">{errors.address}</p>}
                    </div>
                    <button type="submit" className="signup-button">Sign Up as Store Owner</button>
                </form>
                <p>Already have an account? <Link to="/login/store">Login as Store Owner</Link></p>
            </div>
        </div>
    );
};

export default StoreOwnerSignupPage;
