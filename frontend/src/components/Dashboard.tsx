import React from 'react';
import Header from './Header';
import ProductList from './ProductList';
import AdminHomePage from './AdminHomePage';
import './Dashboard.css';

interface User {
  email: string;
  token: string;
  role: string;
  profileImagePath?: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const isAdmin = user.role === 'Admin';

  return (
    <div className="dashboardContainer">
        
      <Header user={user} onLogout={onLogout} />
      
      <main className="dashboardContent">
        {isAdmin ? <AdminHomePage /> : <ProductList />}
      </main>
    </div>
  );
};

export default Dashboard; 