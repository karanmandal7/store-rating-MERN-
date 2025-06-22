import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import AuthContext from '../context/AuthContext';
import './StoreOwnerDashboard.css';

const StoreOwnerDashboard = () => {
    const [store, setStore] = useState(null);
    const [ratings, setRatings] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStoreData = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            try {
                const { data } = await axios.get(`/api/stores/mystore`, config);
                setStore(data.store);
                setRatings(data.ratings);
            } catch (error) {
                console.error("Could not fetch store data", error);
            }
        };
        if (user) {
            fetchStoreData();
        }
    }, [user]);

    if (!store) {
        return (
            <div>
                <Header />
                <div className="store-owner-dashboard">
                    <h1>Store Owner Dashboard</h1>
                    <p>Loading store data...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="store-owner-dashboard">
                <h1>Store Owner Dashboard</h1>
                {store && (
                    <div className="store-details-card">
                        <h2>{store.name}</h2>
                        <p>{store.address}</p>
                        <p>Average Rating: {store.averageRating?.toFixed(1)}</p>
                    </div>
                )}
                <h2>User Ratings</h2>
                <table className="ratings-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.length > 0 ? (
                            ratings.map((rating) => (
                                <tr key={rating._id}>
                                    <td>{rating.user.name}</td>
                                    <td>{rating.rating}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No ratings submitted yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreOwnerDashboard; 