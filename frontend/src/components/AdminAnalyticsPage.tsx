import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';
import AnalyticsCharts from './AnalyticsCharts';
import { getProducts, getCustomerUsers, type Product, type UserDto } from '../services/api';
import './AdminAnalyticsPage.css';

const CATEGORY_COLORS: Record<string, string> = {
  Laptops: '#FF0000',
  Audio: '#008000',
  Wearables: '#0000FF',
  Smartphones: '#FFFF00',
  Tablets: '#FFA500',
  Cameras: '#FF00FF',
  Gaming: '#00FFFF',
  Electronics: '#00FF00',
  Accessories: '#FF1493',
};

const AdminAnalyticsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, usersData] = await Promise.all([
          getProducts(),
          getCustomerUsers()
        ]);
        setProducts(productsData);
        setUsers(usersData);
      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalProducts = products.length;
  const activeUsers = users.length;

  // Top Categories Performance
  const categoryMap: Record<string, number> = {};
  products.forEach(p => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
    percent: totalProducts ? ((value / totalProducts) * 100).toFixed(1) : 0,
    color: CATEGORY_COLORS[name] || '#888',
  }));

  // Price Distribution
  const priceData = [
    { name: 'Under $100', value: products.filter(p => p.price < 100).length },
    { name: '$100-$500', value: products.filter(p => p.price >= 100 && p.price < 500).length },
    { name: '$500-$1000', value: products.filter(p => p.price >= 500 && p.price < 1000).length },
    { name: 'Over $1000', value: products.filter(p => p.price >= 1000).length },
  ];

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admiChartPage">
      <div className="dashboardLeft">
        <AnalyticsCharts categoryData={categoryData} priceData={priceData} />
      </div>
      <div className="dashboardRight">
        <StatCard value={totalProducts.toString()} title="Total Products" color="#B36AFF" />
        <StatCard value={activeUsers.toString()} title="Active Users" color="#E6B433" />
      </div>
    </div>
  );
};

export default AdminAnalyticsPage; 