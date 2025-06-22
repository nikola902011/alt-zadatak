import React from 'react';
import './StatCard.css';

interface StatCardProps {
  value?: string;
  title: string;
  color?: string;
  icon?: string;
  onClick?: () => void;
}

const StatCard = ({ value, title, color, icon, onClick }: StatCardProps) => {
  const isAction = !!icon;

  return (
    <div className={`statCard ${isAction ? 'actionCard' : ''}`} onClick={onClick}>
      {value && <div className="statValue" style={{ color }}>{value}</div>}
      {icon && <img src={icon} alt={title} className="actionIcon" />}
      <div className="cardTitle">{title}</div>
    </div>
  );
};

export default StatCard; 