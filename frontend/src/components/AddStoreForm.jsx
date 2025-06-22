import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './AddForm.css';

const AddStoreForm = ({ onStoreAdded }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [owner, setOwner] = useState('');
    const [storeOwners, setStoreOwners] = useState([]);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchStoreOwners = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get('/api/admin/users', config);
                setStoreOwners(data.filter(u => u.role === 'Store Owner'));
            } catch (err) {
                console.error('Failed to fetch store owners', err);
            }
        };
        fetchStoreOwners();
    }, [user.token]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        if (!owner) {
            setError('Please select a store owner.');
            return;
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('/api/admin/stores', { name, email, address, owner }, config);
            alert('Store created successfully!');
            onStoreAdded();
            setName('');
            setEmail('');
            setAddress('');
            setOwner('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create store');
        }
    };

    return (
        <div className="add-form-container">
            <h3>Add New Store</h3>
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
                    <label>Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Store Owner</label>
                    <select value={owner} onChange={(e) => setOwner(e.target.value)} required>
                        <option value="">Select Owner</option>
                        {storeOwners.map(owner => (
                            <option key={owner._id} value={owner._id}>{owner.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="signup-button">Add Store</button>
            </form>
        </div>
    );
};

export default AddStoreForm; 