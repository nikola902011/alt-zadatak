import React, { useState } from 'react';
import './Header.css';
import { API_BASE_URL } from '../services/api';

interface User {
  email: string;
  role: string;
  profileImagePath?: string;
}

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  const profileImageSrc = user.profileImagePath 
    ? `${API_BASE_URL}${user.profileImagePath}` 
    : '/images/icons/profile.svg';

  const isAdmin = user.role === 'Admin';

  return (
    <header className="appHeader">
      <div className="profileSection">
        <div 
          className="profileImageContainer"
          onClick={() => setDropdownOpen(!isDropdownOpen)} 
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
        <a href="#home">Home</a>
        <a href="#products">Products</a>
        {isAdmin && <a href="#users">Users</a>}
        <a href="#profile">Profile</a>
      </nav>
      
    </header>
  );
};

export default Header; 