import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import AuthContext from '../context/AuthContext';
import StarRating from '../components/StarRating';
import './StorePage.css';
import './DetailPage.css'; // For star rating styles

const StorePage = () => {
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingRatings, setPendingRatings] = useState({}); // To hold ratings before submission
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchStores = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                params: {
                    keyword: searchTerm,
                    _t: new Date().getTime(), 
                }
            };
            const { data } = await axios.get('/api/stores', config);
            setStores(data);
        } catch (error) {
            console.error('Failed to fetch stores', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchStores();
        }
    }, [user, searchTerm]); 

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStores();
    };

    const viewDetails = (id) => {
        navigate(`/store/${id}`);
    };

    const handleRateStore = async (storeId, rating) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data: updatedStore } = await axios.post(`/api/stores/${storeId}/rate`, { rating }, config);
            
            setStores(prevStores =>
                prevStores.map(s => (s._id === storeId ? updatedStore : s))
            );

            // Clear the pending rating for this store after successful submission
            setPendingRatings(prev => {
                const newRatings = { ...prev };
                delete newRatings[storeId];
                return newRatings;
            });

        } catch (error) {
            console.error('Failed to submit rating', error.response?.data?.message || error.message);
            alert('Failed to submit rating.');
        }
    };

    return (
        <div>
            <Header />
            <div className="store-page-container">
                <h1>All Stores</h1>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or address..."
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
                <div className="stores-list">
                    {stores.map((store) => (
                        <div key={store._id} className="store-card">
                            <div onClick={() => viewDetails(store._id)} className="store-card-clickable-content">
                                <h3>{store.name}</h3>
                                <p>{store.address}</p>
                                <p>Average Rating: {store.averageRating?.toFixed(2) || 'N/A'}</p>
                            </div>
                            <div className="rating-section-list">
                                {store.myRating !== null ? (
                                    <>
                                        <p>My Rating: {store.myRating} / 5</p>
                                        <button 
                                            onClick={() => viewDetails(store._id)}
                                            className="rate-button"
                                        >
                                            Update Rating
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => viewDetails(store._id)}
                                        className="rate-button"
                                    >
                                        Rate
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StorePage; 