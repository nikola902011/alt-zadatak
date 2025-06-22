import React, { useState } from 'react';
import './Header.css';

interface User {
  email: string;
  profileImage?: string; // Dodajemo opciono polje za sliku
}

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const profileImage = user.profileImage || '/images/icons/profile.svg';

  return (
    <header className="appHeader">
      <div className="profileSection">
        <div 
          className="profileImageContainer"
          onClick={() => setDropdownOpen(!isDropdownOpen)} 
        >
          <img 
            src={profileImage} 
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
        {isDropdownOpen && (
          <div className="profileDropdown">
            {/* TODO: Dodati sadržaj dropdowna */}
          </div>
        )}
      </div>
      <nav className="mainNav">
        <a href="#home">Home</a>
        <a href="#products">Products</a>
        <a href="#profile">Profile</a>
      </nav>
      
    </header>
  );
};

export default Header; 