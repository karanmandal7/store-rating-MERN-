import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they login,
        // which is a nicer user experience than dropping them off on the home page.
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // If allowedRoles is specified, check if the user's role is in the array.
    // If not specified, default to allowing 'Normal User' for general pages like /stores
    const rolesToCheck = allowedRoles || ['Normal User'];
    
    if (!rolesToCheck.includes(user.role)) {
        // user is logged in but does not have the required role
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute; 