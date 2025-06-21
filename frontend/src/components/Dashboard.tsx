import React from 'react';
import './Dashboard.css';

interface User {
  email: string;
  token: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user.email}!</h1>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main className="dashboard-content">
        <p>You are successfully logged in with JWT authentication.</p>
      </main>
    </div>
  );
};

export default Dashboard; 