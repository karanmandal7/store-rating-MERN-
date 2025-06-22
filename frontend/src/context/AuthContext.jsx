import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null;

        if (userInfo) {
            setUser(userInfo);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('/api/auth/login', { email, password }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            
            // Role-based redirection
            switch (data.role) {
                case 'Admin':
                    navigate('/admin/dashboard');
                    break;
                case 'Store Owner':
                    navigate('/store/dashboard');
                    break;
                case 'Normal User':
                    navigate('/stores');
                    break;
                default:
                    navigate('/');
            }
        } catch (error) {
            alert('Invalid credentials');
            console.error('Login failed', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 