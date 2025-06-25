import  { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

interface User {
  email: string
  token: string
  role: string
  firstName: string
  lastName: string
  profileImagePath?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const profileImagePath = localStorage.getItem('profileImagePath');
    if (token && role) {
      setUser({
        email: 'user@example.com',
        token,
        role,
        firstName: '',
        lastName: '',
        profileImagePath: profileImagePath || undefined
      })
    }
  }, [])

  const handleLogin = (userData: User) => {
    window.location.href = '/dashboard';
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    if (userData.profileImagePath) {
      localStorage.setItem('profileImagePath', userData.profileImagePath);
    }
    setUser({ ...userData, firstName: '', lastName: '' })
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onUserUpdate={handleUserUpdate}/>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
