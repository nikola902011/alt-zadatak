import React, { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

interface User {
  email: string
  token: string
  role: string
  profileImagePath?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const profileImagePath = localStorage.getItem('profileImagePath');
    if (token && role) {
      setUser({ email: 'user@example.com', token, role, profileImagePath: profileImagePath || undefined })
    }
  }, [])

  const handleLogin = (userData: User) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    if (userData.profileImagePath) {
      localStorage.setItem('profileImagePath', userData.profileImagePath);
    }
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('profileImagePath');
    localStorage.removeItem('activeTab');
    setUser(null)
  }

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
