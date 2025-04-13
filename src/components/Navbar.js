import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Navbar = () => {
  const location = useLocation();
  const { user, login, logout } = useAuth();
  
  return (
    <nav className="fixed w-full z-50 flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-[240px]">
        <Link to="/" className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-maroon">AggieClassAlert</h1>
        </Link>
      </div>

      {/* Center Navigation */}
      <div className="hidden lg:flex justify-center flex-1 items-center">
        <div className="flex space-x-6">
          <Link 
            to="/my-alerts" 
            className={`px-4 py-1 text-sm font-medium rounded transition-colors ${
              location.pathname === '/my-alerts' 
                ? 'bg-maroon/5 text-maroon' 
                : 'text-maroon hover:bg-maroon/5'
            }`}
          >
            My Alerts
          </Link>
          <Link 
            to="/search" 
            className={`px-4 py-1 text-sm font-medium rounded transition-colors ${
              location.pathname === '/search' 
                ? 'bg-maroon/5 text-maroon' 
                : 'text-maroon hover:bg-maroon/5'
            }`}
          >
            Class Search
          </Link>
          <Link 
            to="/settings" 
            className={`px-4 py-1 text-sm font-medium rounded transition-colors ${
              location.pathname === '/settings' 
                ? 'bg-maroon/5 text-maroon' 
                : 'text-maroon hover:bg-maroon/5'
            }`}
          >
            Settings
          </Link>
          <Link 
            to="/help" 
            className={`px-4 py-1 text-sm font-medium rounded transition-colors ${
              location.pathname === '/help' 
                ? 'bg-maroon/5 text-maroon' 
                : 'text-maroon hover:bg-maroon/5'
            }`}
          >
            Help
          </Link>
        </div>
      </div>

      {/* Right Navigation */}
      <div className="flex items-center min-w-[240px] justify-end">
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{user.email}</span>
            <button
              onClick={logout}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={(credentialResponse) => login(credentialResponse.credential)}
              onError={() => console.log('Login Failed')}
              useOneTap
              theme="outline"
              size="medium"
              text="signin_with"
              shape="rectangular"
            />
          </GoogleOAuthProvider>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 