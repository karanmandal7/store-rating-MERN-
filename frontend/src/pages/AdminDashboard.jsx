import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import AuthContext from '../context/AuthContext';
import UserList from '../components/UserList';
import StoreList from '../components/StoreList';
import AddUserForm from '../components/AddUserForm';
import AddStoreForm from '../components/AddStoreForm';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [view, setView] = useState('lists'); // lists, addUser, addStore
    const { user } = useContext(AuthContext);
    const [refreshKey, setRefreshKey] = useState(0); // Used to trigger list refresh

    useEffect(() => {
        const fetchStats = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/admin/stats', config);
            setStats(data);
        };
        if (user) {
            fetchStats();
        }
    }, [user, refreshKey]);

    const handleFormSuccess = () => {
        setRefreshKey(oldKey => oldKey + 1); // Trigger a refresh of stats and lists
        setView('lists'); // Go back to the lists view
    };

    return (
        <div>
            <Header />
            <div className="admin-dashboard">
                <h1>Admin Dashboard</h1>
                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h2>Total Users</h2>
                            <p>{stats.users}</p>
                        </div>
                        <div className="stat-card">
                            <h2>Total Stores</h2>
                            <p>{stats.stores}</p>
                        </div>
                        <div className="stat-card">
                            <h2>Total Ratings</h2>
                            <p>{stats.ratings}</p>
                        </div>
                    </div>
                )}

                <div className="admin-controls">
                    <button onClick={() => setView('lists')} disabled={view === 'lists'}>View Lists</button>
                    <button onClick={() => setView('addUser')} disabled={view === 'addUser'}>Add User</button>
                    <button onClick={() => setView('addStore')} disabled={view === 'addStore'}>Add Store</button>
                </div>

                {view === 'lists' && (
                    <>
                        <UserList key={`user-list-${refreshKey}`} />
                        <StoreList key={`store-list-${refreshKey}`} />
                    </>
                )}
                {view === 'addUser' && <AddUserForm onUserAdded={handleFormSuccess} />}
                {view === 'addStore' && <AddStoreForm onStoreAdded={handleFormSuccess} />}
            </div>
        </div>
    );
};

export default AdminDashboard; 