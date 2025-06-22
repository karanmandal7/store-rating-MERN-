import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [filter, setFilter] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/admin/users', config);
            setUsers(data);
            setFilteredUsers(data);
        };
        if (user) {
            fetchUsers();
        }
    }, [user]);

    useEffect(() => {
        let sortedUsers = [...users];
        if (sortConfig.key) {
            sortedUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        let f = filter.toLowerCase();
        let filtered = sortedUsers.filter(u => 
            u.name.toLowerCase().includes(f) ||
            u.email.toLowerCase().includes(f) ||
            u.address.toLowerCase().includes(f) ||
            u.role.toLowerCase().includes(f)
        );
        setFilteredUsers(filtered);
    }, [users, sortConfig, filter]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const viewDetails = (id) => {
        navigate(`/admin/user/${id}`);
    };

    return (
        <div className="user-list-container">
            <h2>Users</h2>
            <input
                type="text"
                placeholder="Filter by name, email, address, or role..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-input"
            />
            <table className="users-table">
                <thead>
                    <tr>
                        <th onClick={() => requestSort('name')}>Name</th>
                        <th onClick={() => requestSort('email')}>Email</th>
                        <th onClick={() => requestSort('address')}>Address</th>
                        <th onClick={() => requestSort('role')}>Role</th>
                        <th>Store Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((u) => (
                        <tr key={u._id} onClick={() => viewDetails(u._id)} className="clickable-row">
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.address}</td>
                            <td>{u.role}</td>
                            <td>
                                {u.role === 'Store Owner' ? (u.storeAverageRating !== undefined ? u.storeAverageRating : 'N/A') : ''}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList; 