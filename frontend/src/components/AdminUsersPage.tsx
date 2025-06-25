import { useState, useEffect } from 'react';
import { getCustomerUsers, getDashboardStats, type UserListDto, API_BASE_URL, deleteUsers } from '../services/api';
import StatCard from './StatCard';
import './AdminUsersPage.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserListDto[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, statsData] = await Promise.all([
          getCustomerUsers(),
          getDashboardStats()
        ]);
        setUsers(usersData);
        setTotalUsers(statsData.activeUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteModeToggle = () => {
    setDeleteMode((prev) => !prev);
    if (deleteMode) {
      setSelectedUsers(new Set());
    }
  };

  const handleUserCheckbox = (userId: number) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleDelete = async () => {
    if (selectedUsers.size === 0) return;
    try {
      await deleteUsers(Array.from(selectedUsers));
      const newUsers = users.filter(user => !selectedUsers.has(user.id));
      setUsers(newUsers);
      setTotalUsers(newUsers.length);
      setSelectedUsers(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete users');
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="adminUsersPage">
      <div className="userListContainer">
        <h2 className="containerTitle">Active Users</h2>
        <ul className="userList">
          {users.map(user => (
            <li key={user.id} className="userItem">
              <div className="userInfo">
                {deleteMode && (
                  <div className="userCheckboxContainer">
                    <input
                      type="checkbox"
                      className="userCheckbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleUserCheckbox(user.id)}
                    />
                  </div>
                )}
                <img
                  className="userAvatar"
                  src={user.profileImagePath ? `${API_BASE_URL}${user.profileImagePath}` : '/images/icons/profile.svg'}
                  alt="avatar"
                />
                <div className="userDetails">
                  <div>{user.firstName} {user.lastName}</div>
                  <div>{new Date(user.createdAt).toLocaleDateString('sr-RS')}</div>
                </div>
              </div>
              <div className="userEmail">{user.email}</div>
            </li>
          ))}
        </ul>
        {deleteMode && (
          <div className="deleteSection">
            <button
              className="deleteButtonUsers"
              disabled={selectedUsers.size === 0}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <aside className="sidebar">
        <StatCard 
          value={totalUsers.toString()}
          title="Total"
          color="#E6B433"
        />
        <StatCard 
          title="Delete Users"
          icon="/images/icons/binIcon.svg"
          onClick={handleDeleteModeToggle}
        />
      </aside>
    </div>
  );
};

export default AdminUsersPage; 