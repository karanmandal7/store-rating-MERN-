import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
      <Header />
      <div className="homepage-container">
        <div className="welcome-section">
          <h1>Welcome to the Store Rating App</h1>
          <p>Your one-stop destination to rate and review local stores.</p>
        </div>

        <div className="role-selection-container">
          <div className="role-card">
            <h2>For Customers</h2>
            <p>Browse stores, read reviews, and share your own experiences.</p>
            <div className="role-actions">
              <Link to="/login/user" className="btn btn-primary">User Login</Link>
              <Link to="/signup/user" className="btn btn-secondary">User Signup</Link>
            </div>
          </div>

          <div className="role-card">
            <h2>For Store Owners</h2>
            <p>Manage your store's profile, view ratings, and engage with your customers.</p>
            <div className="role-actions">
                <Link to="/login/store" className="btn btn-primary">Owner Login</Link>
            </div>
          </div>

          <div className="role-card">
            <h2>For Administrators</h2>
            <p>Oversee the entire platform, manage users, and ensure data integrity.</p>
            <div className="role-actions">
              <Link to="/login/admin" className="btn btn-primary">Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 