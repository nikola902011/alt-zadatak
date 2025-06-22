import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { getDashboardStats } from '../services/api';
import './AdminHomePage.css';

const AdminHomePage = () => {
  const [stats, setStats] = useState({ totalProducts: 0, activeUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="errorMessage">{error}</div>;
  }

  return (
    <div className="adminHomePage">
      <div className="statsRow">
        <StatCard 
          value={stats.totalProducts.toString()} 
          title="Total Products" 
          color="#B925E4" 
        />
        <StatCard 
          value={stats.activeUsers.toString()} 
          title="Active Users" 
          color="#E6B433" 
        />
      </div>
      <div className="actionsSection">
        <div className="actionsHeader">Quick Actions</div>
        <div className="actionsRow">
          <StatCard 
            title="Add Products" 
            icon="/images/icons/addProduct.svg"
          />
          <StatCard 
            title="Analytics" 
            icon="/images/icons/Analytics.svg"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage; 