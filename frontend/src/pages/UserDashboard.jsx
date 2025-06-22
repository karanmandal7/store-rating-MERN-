import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import './HomePage.css';

const UserDashboard = () => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const fetchStores = async () => {
            const { data } = await axios.get('/api/stores');
            setStores(data);
        };
        fetchStores();
    }, []);

    return (
        <div>
            <Header />
            <div className="homepage-container">
                <h1>All Stores</h1>
                <div className="stores-grid">
                    {stores.map((store) => (
                        <div key={store._id} className="store-card">
                            <h2>{store.name}</h2>
                            <p>{store.address}</p>
                            <Link to={`/store/${store._id}`}>View Details</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard; 