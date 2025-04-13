import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5001';

const SimpleLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  //console.log('SimpleLogin component rendered with onLoginSuccess:', !!onLoginSuccess);
  
  // Log that the API URL is correctly set
  useEffect(() => {
    console.log('SimpleLogin component mounted with API_URL:', API_URL);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // For debugging - show network request details
      const mongodbLoginUrl = `${API_URL}/api/users/login`;
      //console.log(`🔴 LOGIN REQUEST - ${new Date().toISOString()}`);
      //console.log('API_URL:', API_URL);
      //console.log('Full login URL:', mongodbLoginUrl);
      
      // Simple email normalization - just lowercase and trim
      const cleanEmail = email.trim().toLowerCase();
      
      //console.log('Original email:', email);
      //console.log('Clean email:', cleanEmail);
      
      // Log request details for debugging
      //console.log('Making direct API call to:', mongodbLoginUrl);
      //console.log('Request method:', 'POST');
      //console.log('Request payload:', JSON.stringify({ email: cleanEmail }));
      
      // Directly make the API request to ensure it goes through
      const response = await fetch(mongodbLoginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail })
      });
      
      //console.log('Login response status:', response.status);
      const data = await response.json();
      //console.log('Login response data:', data);
      
      if (response.ok) {
        //console.log('Login successful:', data);
        setMessage('Login successful!');
        
        // Store email in localStorage
        localStorage.setItem('userEmail', cleanEmail);
        //console.log('Email stored in localStorage:', cleanEmail);
        
        // IMPORTANT: Call the parent's callback IMMEDIATELY
        // Don't wait for the verification or anything else
        if (onLoginSuccess) {
          //console.log('CALLING onLoginSuccess callback with email:', cleanEmail);
          onLoginSuccess(cleanEmail);
        } else {
          console.warn('onLoginSuccess callback is not provided!');
        }
      } else {
        console.error('Login failed:', data);
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      setError('An error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Sign in with Email</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg ${
            loading ? 'bg-gray-400' : 'bg-maroon hover:bg-maroon/90'
          } text-white transition-colors`}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

export default SimpleLogin; 