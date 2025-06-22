import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Header from '../components/Header';
import StarRating from '../components/StarRating';
import './DetailPage.css';

const StoreDetailPage = () => {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [myRating, setMyRating] = useState(null);
    const [pendingRating, setPendingRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const fetchStore = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`/api/stores/${id}`, config);
            setStore(data);
            setMyRating(data.myRating);
        } catch (err) {
            console.error('Failed to fetch store details', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchStore();
        }
    }, [id, user]);

    const handleRateStore = async () => {
        if (pendingRating === null) return;
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data: updatedStore } = await axios.post(`/api/stores/${id}/rate`, { rating: pendingRating }, config);
            setStore(updatedStore);
            setMyRating(updatedStore.myRating);
            setPendingRating(null);
        } catch (error) {
            console.error('Failed to submit rating', error.response?.data?.message || error.message);
            alert('Failed to submit rating.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!store) {
        return <div>Store not found.</div>;
    }

    const displayRating = pendingRating !== null ? pendingRating : myRating;

    return (
        <div>
            <Header />
            <div className="detail-page">
                <h1>{store.name}</h1>
                <dl className="detail-grid">
                    <dt>Address:</dt>
                    <dd>{store.address}</dd>
                    <dt>Average Rating:</dt>
                    <dd>{store.averageRating?.toFixed(2) || 'Not yet rated'}</dd>
                    {user && user.role === 'Normal User' && (
                        <>
                            <dt>My Rating:</dt>
                            <dd>{myRating !== null ? `${myRating} / 5` : 'You have not rated yet'}</dd>
                        </>
                    )}
                </dl>
                
                {user && user.role === 'Normal User' && (
                    <div className="rating-section">
                        <h2>{myRating !== null ? 'Update Your Rating' : 'Rate this Store'}</h2>
                        <div className="rating-section-list">
                            <StarRating rating={displayRating} onSelect={setPendingRating} />
                            {pendingRating !== null && (
                                <button onClick={handleRateStore} className="submit-rating-button">
                                    Submit
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoreDetailPage; 