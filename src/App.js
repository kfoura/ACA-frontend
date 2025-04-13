import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MyAlerts from './components/MyAlerts';
import Search from './components/Search';
import Settings from './components/Settings';
import LoginModal from './components/LoginModal';
import Help from './components/Help';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (loading) {
    return <div>Loading...</div>;
  }

  // If it's the homepage, show it without the login modal
  if (isHomePage) {
    return children;
  }

  // For other pages, show the login modal if not logged in
  if (!user) {
    return (
      <>
        {children}
        <LoginModal 
          isOpen={true} 
          onClose={() => setShowLoginModal(false)} 
        />
      </>
    );
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/dashboard" element={<Navigate to="/my-alerts" replace />} />
            <Route
              path="/my-alerts"
              element={
                <ProtectedRoute>
                  <MyAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/help" element={<Help />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 