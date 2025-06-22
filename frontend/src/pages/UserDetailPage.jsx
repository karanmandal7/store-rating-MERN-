import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Header from '../components/Header';
import './DetailPage.css';

const UserDetailPage = () => {
    const { id } = useParams();
    const [detailedUser, setDetailedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get(`/api/admin/users/${id}`, config);
                setDetailedUser(data);
            } catch (err) {
                console.error('Failed to fetch user details', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, user.token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!detailedUser) {
        return <div>User not found.</div>;
    }

    return (
        <div>
            <Header />
            <div className="detail-page">
                <h1>User Details</h1>
                <dl className="detail-grid">
                    <dt>Name:</dt>
                    <dd>{detailedUser.name}</dd>
                    <dt>Email:</dt>
                    <dd>{detailedUser.email}</dd>
                    <dt>Address:</dt>
                    <dd>{detailedUser.address || 'N/A'}</dd>
                    <dt>Role:</dt>
                    <dd>{detailedUser.role}</dd>
                    {detailedUser.role === 'Store Owner' && (
                        <>
                            <dt>Store Avg. Rating:</dt>
                            <dd>{detailedUser.storeAverageRating?.toFixed(2) || 'N/A'}</dd>
                        </>
                    )}
                </dl>
            </div>
        </div>
    );
};

export default UserDetailPage; 