import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProductList from './ProductList';
import AdminHomePage from './AdminHomePage';
import AdminProductPage from './AdminProductPage';
import AdminUsersPage from './AdminUsersPage';
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
  const [activeTab, setActiveTab] = useState(() => {
    // Učitaj sačuvanu stranicu iz localStorage ili koristi 'home' kao default
    return localStorage.getItem('activeTab') || 'home';
  });
  
  const isAdmin = user.role === 'Admin';

  // Sačuvaj trenutnu stranicu u localStorage kada se promeni
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    // Logika za Admina
    if (isAdmin) {
      switch (activeTab) {
        case 'home':
          return <AdminHomePage />;
        case 'products':
          return <AdminProductPage />;
        case 'users':
          return <AdminUsersPage />;
        case 'profile':
          return <div>Admin Profile Page - Coming Soon!</div>;
        default:
          return <AdminHomePage />;
      }
    }

    // Logika za Customera
    switch (activeTab) {
      case 'home':
      case 'products':
        return <ProductList />;
      case 'profile':
        return <div>Customer Profile Page - Coming Soon!</div>;
      default:
        return <ProductList />;
    }
  };

  return (
    <div className="dashboardContainer">
      <Header 
        user={user} 
        onLogout={onLogout}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <main className="dashboardContent">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard; 