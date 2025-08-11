import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserLoginPage from './pages/UserLoginPage';
import StoreOwnerLoginPage from './pages/StoreOwnerLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import UserSignupPage from './pages/UserSignupPage';
import StoreOwnerSignupPage from './pages/StoreOwnerSignupPage';
import AdminSignupPage from './pages/AdminSignupPage';
import StorePage from './pages/StorePage';
import StoreDetailPage from './pages/StoreDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Auth Routes */}
      <Route path="/login/user" element={<UserLoginPage />} />
      <Route path="/login/store" element={<StoreOwnerLoginPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/signup/user" element={<UserSignupPage />} />
      <Route path="/signup/store-owner" element={<StoreOwnerSignupPage />} />
      <Route path="/signup/admin" element={<AdminSignupPage />} />

      {/* Protected Routes */}
      <Route path="/stores" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
      <Route path="/store/:id" element={<ProtectedRoute><StoreDetailPage /></ProtectedRoute>} />
      <Route path="/change-password" element={
        <ProtectedRoute allowedRoles={['Normal User', 'Store Owner']}>
          <ChangePasswordPage />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/store/dashboard" element={
        <ProtectedRoute allowedRoles={['Store Owner']}>
          <StoreOwnerDashboard />
        </ProtectedRoute>
      } />

    </Routes>
  );
}

export default App;
