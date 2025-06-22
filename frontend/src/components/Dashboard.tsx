import React from 'react';
import Header from './Header';
import ProductList from './ProductList';
import './Dashboard.css';

interface User {
  email: string;
  token: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  return (
    <div className="dashboardContainer">
        
      <Header user={user} onLogout={onLogout} />
      
      <main className="dashboardContent">
        <ProductList />
      </main>
    </div>
  );
};

export default Dashboard; 