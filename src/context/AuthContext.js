import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);
const API_URL = 'https://api.aggieclassalert.com';
const apiKey = process.env.REACT_APP_API_KEY;


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on component mount
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        
        // Ensure user exists in MongoDB
        if (decoded.email) {
          syncUserToMongoDB(decoded.email, decoded);
        }
      } catch (error) {
        //console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Function to ensure user exists in MongoDB
  const syncUserToMongoDB = async (email, userData = {}) => {
    try {
      //console.log(`Syncing user to MongoDB: ${email}`);
      
      // Simplify - just use the email directly
      const cleanEmail = email.trim().toLowerCase();
      
      // Call MongoDB API to ensure user exists
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey

        },
        body: JSON.stringify({ 
          email: cleanEmail,
          original_email: email,
          google_auth: true,
          user_data: userData
        })
      });
      
      const data = await response.json();
      //console.log('MongoDB sync response:', data);
      
      // Also store email in localStorage for SimpleLogin compatibility
      localStorage.setItem('userEmail', cleanEmail);
      
      return data.success;
    } catch (error) {
      //console.error('Error syncing user to MongoDB:', error);
      return false;
    }
  };

  const login = async (token) => {
    localStorage.setItem('token', token);
    const id_token = token.credential;
    localStorage.setItem('id_token', id_token);
    
    const decoded = jwtDecode(token);
    setUser(decoded);
    
    //console.log('Google login decoded token:', decoded);
    
    // Ensure this Google user exists in our MongoDB database
    if (decoded.email) {
      await syncUserToMongoDB(decoded.email, decoded);
    } else {
      //console.warn('No email found in Google token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getAuthHeaders }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
