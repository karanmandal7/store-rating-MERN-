import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './StoreList.css';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [filter, setFilter] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStores = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/admin/stores', config);
            setStores(data);
            setFilteredStores(data);
        };
        if (user) {
            fetchStores();
        }
    }, [user]);

    useEffect(() => {
        let sortedStores = [...stores];
        if (sortConfig.key) {
            sortedStores.sort((a, b) => {
                const getNestedValue = (obj, key) => key.split('.').reduce((o, i) => (o ? o[i] : null), obj);

                const valA = getNestedValue(a, sortConfig.key);
                const valB = getNestedValue(b, sortConfig.key);

                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        let f = filter.toLowerCase();
        let filtered = sortedStores.filter(s => 
            s.name.toLowerCase().includes(f) ||
            s.email.toLowerCase().includes(f) ||
            s.address.toLowerCase().includes(f) ||
            s.owner?.name.toLowerCase().includes(f) ||
            s.owner?.email.toLowerCase().includes(f)
        );
        setFilteredStores(filtered);
    }, [stores, sortConfig, filter]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const viewDetails = (id) => {
        navigate(`/admin/store/${id}`);
    };

    return (
        <div className="store-list-container">
            <h2>Stores</h2>
            <input
                type="text"
                placeholder="Filter by store name, email, address, owner..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-input"
            />
            <table className="stores-table">
                <thead>
                    <tr>
                        <th onClick={() => requestSort('name')}>Name</th>
                        <th onClick={() => requestSort('email')}>Email</th>
                        <th onClick={() => requestSort('address')}>Address</th>
                        <th onClick={() => requestSort('owner.name')}>Owner Name</th>
                        <th onClick={() => requestSort('averageRating')}>Avg. Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStores.map((s) => (
                        <tr key={s._id} onClick={() => viewDetails(s._id)} className="clickable-row">
                            <td>{s.name}</td>
                            <td>{s.email}</td>
                            <td>{s.address}</td>
                            <td>{s.owner?.name}</td>
                            <td>{s.averageRating?.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StoreList; 