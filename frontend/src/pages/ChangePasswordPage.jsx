import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Header from '../components/Header';
import './ChangePasswordPage.css';

const ChangePasswordPage = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useContext(AuthContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        // Add password complexity validation
        if (newPassword.length < 8 || newPassword.length > 16 || !/^(?=.*[A-Z])(?=.*[!@#$&*])/.test(newPassword)) {
            setError('Password must be 8-16 characters long and include at least one uppercase letter and one special character.');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('/api/users/profile/password', { oldPassword, newPassword }, config);
            setSuccess(data.message);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div>
            <Header />
            <div className="change-password-page">
                <div className="change-password-container">
                    <h1 className="change-password-title">Change Password</h1>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <form onSubmit={submitHandler} className="change-password-form">
                        <div className="form-group">
                            <label>Old Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="signup-button">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage; 