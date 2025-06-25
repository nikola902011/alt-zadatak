import { useState, useEffect } from 'react';
import Header from './Header';
import ProductList from './ProductList';
import AdminHomePage from './AdminHomePage';
import AdminProductPage from './AdminProductPage';
import AdminUsersPage from './AdminUsersPage';
import AdminAnalyticsPage from './AdminAnalyticsPage';
import EditProfilePage from './EditProfilePage';
import './Dashboard.css';

interface User {
  email: string;
  token: string;
  role: string;
  firstName: string;
  lastName: string;
  profileImagePath?: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (updatedUser: User) => void;
}

const Dashboard = ({ user, onLogout, onUserUpdate }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'home';
  });
  const [isImageUpdate, setIsImageUpdate] = useState(false);
  
  const isAdmin = user.role === 'Admin';

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleTabChange = (tab: string, options?: { openAddModal?: boolean }) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    // Logika za Admina
    if (isAdmin) {
      switch (activeTab) {
        case 'home':
          return <AdminHomePage onTabChange={handleTabChange} />;
        case 'products':
          return <AdminProductPage />;
        case 'users':
          return <AdminUsersPage />;
        case 'analytics':
          return <AdminAnalyticsPage />;
        case 'profile':
          return <EditProfilePage user={user} isImageUpdate={isImageUpdate} setIsImageUpdate={setIsImageUpdate} onUserUpdate={onUserUpdate} />;
        default:
          return <AdminHomePage onTabChange={handleTabChange} />;
      }
    }

    // Logika za Customera
    switch (activeTab) {
      case 'home':
      case 'products':
        return <ProductList />;
      case 'profile':
        return <EditProfilePage user={user} isImageUpdate={isImageUpdate} setIsImageUpdate={setIsImageUpdate} onUserUpdate={onUserUpdate} />;
      default:
        return <ProductList />;
    }
  };

  return (
    <div className="dashboardContainer">
      <Header 
        user={user} 
        onLogout={onLogout}
        onTabChange={handleTabChange}
        setIsImageUpdate={setIsImageUpdate}
      />
      
      <main className="dashboardContent">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard; 