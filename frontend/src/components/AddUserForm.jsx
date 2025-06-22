import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './AddForm.css';

const AddUserForm = ({ onUserAdded }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('Normal User');
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('/api/admin/users', { name, email, password, address, role }, config);
            alert('User created successfully!');
            onUserAdded(); // Callback to refresh the user list
            // Clear form
            setName('');
            setEmail('');
            setPassword('');
            setAddress('');
            setRole('Normal User');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <div className="add-form-container">
            <h3>Add New User</h3>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={submitHandler} className="add-form">
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Normal User">Normal User</option>
                        <option value="Store Owner">Store Owner</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="signup-button">Add User</button>
            </form>
        </div>
    );
};

export default AddUserForm; 