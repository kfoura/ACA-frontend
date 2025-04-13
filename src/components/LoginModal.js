import React, { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  // To bypass any environment variable issues, hardcode for testing
  const clientId = '76395303091-hn56cbkb13d3eo431384hmvksn52lrt2.apps.googleusercontent.com';
  
  useEffect(() => {
    //console.log("Using client ID:", clientId);
  }, [clientId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <Link to="/" className="text-maroon hover:text-maroon/80 absolute top-4 right-4">
          Back to Homepage
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to continue</h2>
        <p className="text-gray-600 mb-6">Please sign in to access this feature.</p>
        
        {clientId ? (
          <div className="flex justify-center">
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  //console.log("Login success:", credentialResponse);
                  login(credentialResponse.credential);
                  onClose();
                }}
                onError={(error) => {
                  console.error("Login Failed:", error);
                }}
                useOneTap
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </GoogleOAuthProvider>
          </div>
        ) : (
          <div className="text-red-500 text-center">
            Client ID not found. Please check your environment variables.
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal; 