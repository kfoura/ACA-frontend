import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Dashboard from './Dashboard';
import Settings from './Settings';
import Navbar from './Navbar';
import Footer from './Footer';
import Search from './Search';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  // Check login status on mount
  useEffect(() => {
    // Check if user is logged in
    const storedUserEmail = localStorage.getItem('userEmail');
    if (storedUserEmail) {
      setIsLoggedIn(true);
      setUserEmail(storedUserEmail);
    }
  }, []);
  
  // Handle login
  const handleLogin = (email) => {
    localStorage.setItem('userEmail', email);
    setUserEmail(email);
    setIsLoggedIn(true);
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail('');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<Dashboard userEmail={userEmail} />} />
            <Route path="/settings" element={<Settings userEmail={userEmail} />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 