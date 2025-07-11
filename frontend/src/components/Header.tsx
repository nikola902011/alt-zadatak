import React from 'react';
import './Header.css';
import { API_BASE_URL } from '../services/api';

interface User {
  email: string;
  role: string;
  profileImagePath?: string;
}

interface HeaderProps {
  user: User;
  onTabChange: (tab: string) => void;
  setIsImageUpdate: (val: boolean) => void;
}


const Header = ({ user, onTabChange, setIsImageUpdate }: HeaderProps) => {
  
  const profileImageSrc = user.profileImagePath 
    ? `${API_BASE_URL}${user.profileImagePath}` 
    : '/images/icons/profile.svg';

  const isAdmin = user.role === 'Admin' || user.role === 'admin';

  const handleNavClick = (e: React.MouseEvent, tab: string) => {
    e.preventDefault();
    onTabChange(tab);
  };

  return (
    <header className="appHeader">
      <div className="profileSection">
        <div 
          className="profileImageContainer"
          onClick={() => {
            onTabChange('profile');
            setIsImageUpdate(true);
          }}
        >
          <img 
            src={profileImageSrc} 
            alt="Profile" 
            className="profileImage"
          />
          <div className="editIconContainer">
            <img 
              src="/images/icons/pen-to-square.svg" 
              alt="Edit" 
              className="editIcon"
            />
          </div>
        </div>
       
      </div>
      <nav className="mainNav">
        <div className="headerNavItemsHolder">
          <div className="headerNavItem" onClick={(e) => handleNavClick(e, 'home')}>Home</div>
          <div className="headerNavItem" onClick={(e) => handleNavClick(e, 'products')}>Products</div>
          {isAdmin && <div className="headerNavItem" onClick={(e) => handleNavClick(e, 'users')}>Users</div>}
          <div className="headerNavItem" onClick={(e) => handleNavClick(e, 'profile')}>Profile</div>
        </div>
        
      </nav>
      
      
    </header>
  );
};

export default Header; 