import React, { useState, useEffect } from 'react';
import { PhoneIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

const API_URL = 'http://localhost:5001';

const Settings = (props) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [actualVerificationCode, setActualVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userPhoneInfo, setUserPhoneInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use only the original carriers that were in the code before
  const carriers = [
    { id: 'verizon', name: 'Verizon', domain: '@vtext.com' },
    { id: 'att', name: 'AT&T', domain: '@txt.att.net' },
    { id: 'tmobile', name: 'T-Mobile', domain: '@tmomail.net' },
    { id: 'sprint', name: 'Sprint', domain: '@messaging.sprintpcs.com' },
    { id: 'cricket', name: 'Cricket Wireless', domain: '@mms.cricketwireless.net' },
    { id: 'boost', name: 'Boost Mobile', domain: '@sms.myboostmobile.com' },
    { id: 'uscellular', name: 'U.S. Cellular', domain: '@email.uscc.net' },
    { id: 'metro', name: 'Metro by T-Mobile', domain: '@mymetropcs.com' },
  ];

  // Fetch user data including phone info when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      
      try {
        // First try to get the email from props, then localStorage
        const userEmail = props.userEmail || localStorage.getItem('userEmail') || '';
        //console.log('Checking for existing phone info with email:', userEmail);
        
        let response;
        
        if (userEmail) {
          // Try to get user profile with the email
          response = await fetch(`${API_URL}/api/users/profile?email=${encodeURIComponent(userEmail)}`);
        } else {
          // If no email, try to get user with blank email
          response = await fetch(`${API_URL}/api/users/profile?email=`);
        }
        
        if (response.ok) {
          const userData = await response.json();
          //console.log('User profile data:', userData);
          
          if (userData.phone_number && userData.phone_verified) {
            // User already has a verified phone number
            //console.log('Found existing verified phone:', userData.phone_number);
            setUserPhoneInfo({
              phoneNumber: userData.phone_number,
              carrier: userData.phone_carrier || '',
              verifiedAt: userData.phone_verified_at ? new Date(userData.phone_verified_at * 1000) : null
            });
            
            // Pre-fill the form with the existing data
            setPhoneNumber(userData.phone_number);
            setCarrier(userData.phone_carrier || '');
            setVerificationSuccess(true);
          } else if (userData.phone_number) {
            // User has a phone number but it's not verified yet
            //console.log('Found existing unverified phone:', userData.phone_number);
            setPhoneNumber(userData.phone_number);
            setCarrier(userData.phone_carrier || '');
          }
        } else {
          console.log('No existing user profile found or error fetching profile');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [props.userEmail]);

  // Generate a random verification code
  const generateVerificationCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Send verification code to phone
  const sendVerificationCode = async () => {
    // Validate phone number is exactly 10 digits
    if (!phoneNumber || phoneNumber.length !== 10) {
      setVerificationError('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate carrier selection
    if (!carrier) {
      setVerificationError('Please select your carrier');
      return;
    }

    setIsSubmitting(true);
    setVerificationError('');

    try {
      // Get user's email from props or localStorage
      const userEmail = props.userEmail || localStorage.getItem('userEmail') || '';
      //console.log('User email for verification:', userEmail);
      
      // Call the API endpoint
      const response = await fetch(`${API_URL}/api/verify-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          carrier: carrier,
          email: userEmail
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }
      
      // In a real production environment, the server wouldn't return the code
      // But for our development purposes, we'll use it to simplify testing
      if (data.code) {
        setActualVerificationCode(data.code);
        //console.log(`Verification code sent: ${data.code}`);
        //console.log(`Sent to: ${data.phone_formatted}@${carriers.find(c => c.id === carrier).domain}`);
      } else {
        throw new Error('No verification code received from server');
      }
      
      setVerificationSent(true);
      
    } catch (error) {
      console.error('Error sending verification code:', error);
      setVerificationError(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify the code entered by the user
  const verifyCode = async () => {
    if (verificationCode.length !== 5) {
      setVerificationError('Please enter the 5-character verification code');
      return;
    }

    setIsSubmitting(true);
    setVerificationError('');

    try {
      // Get user's email from props or localStorage
      const userEmail = props.userEmail || localStorage.getItem('userEmail') || '';
      //console.log('User email for confirmation:', userEmail);
      
      // Call the confirmation endpoint
      const response = await fetch(`${API_URL}/api/verify-phone/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: verificationCode,
          expectedCode: actualVerificationCode,
          phoneNumber: phoneNumber,
          carrier: carrier,
          email: userEmail
        }),
      });
      
      const data = await response.json();
      //console.log('Verification response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }
      
      // If verification successful
      setVerificationSuccess(true);
      setVerificationError('');
      
      // Update UI to show success message
      if (data.associated_with_email) {
        setSuccessMessage('Your phone number has been verified and associated with your account');
        
        // Update the user phone info
        setUserPhoneInfo({
          phoneNumber: data.phone_number,
          carrier: carrier,
          verifiedAt: new Date()
        });
        
        // Refresh user profile to confirm the update in the database
        try {
          const profileUrl = userEmail 
            ? `${API_URL}/api/users/profile?email=${encodeURIComponent(userEmail)}`
            : `${API_URL}/api/users/profile?phone=${encodeURIComponent(phoneNumber)}`;
            
          const profileResponse = await fetch(profileUrl);
          
          if (profileResponse.ok) {
            const userData = await profileResponse.json();
            //console.log("Updated user profile:", userData);
            
            if (userData.phone_number && userData.phone_verified) {
              setUserPhoneInfo({
                phoneNumber: userData.phone_number,
                carrier: userData.phone_carrier || carrier,
                verifiedAt: userData.phone_verified_at ? new Date(userData.phone_verified_at * 1000) : new Date()
              });
            }
          }
        } catch (refreshError) {
          console.error("Error refreshing user profile:", refreshError);
        }
      } else {
        setSuccessMessage('Your phone number has been verified successfully');
      }
      
    } catch (error) {
      console.error('Error verifying code:', error);
      setVerificationError(error.message || 'Failed to verify code. Please try again.');
      setVerificationSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission (save phone number)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!verificationSuccess) {
      setVerificationError('Please verify your phone number first');
      return;
    }

    setIsSubmitting(true);
    
    // In a real implementation, save the verified phone number to the user's account
    // For this implementation, the number is already saved in the verification step
    setTimeout(() => {
      // Success - using UI notification instead of alert popup
      //console.log(`Saved verified phone: ${phoneNumber}, carrier: ${carrier}`);
      setSuccessMessage('Phone number saved successfully!');
      setIsSubmitting(false);
    }, 500);
  };

  // Reset phone verification to change number
  const handleResetVerification = () => {
    setPhoneNumber('');
    setCarrier('');
    setVerificationSuccess(false);
    setVerificationSent(false);
    setVerificationCode('');
    setActualVerificationCode('');
    setSuccessMessage('');
    setUserPhoneInfo(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-maroon border-t-transparent rounded-full"></div>
        <span className="ml-2 text-gray-700">Loading your settings...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Phone Settings</h1>
          <p className="text-gray-600">Set up your phone number for SMS notifications</p>
        </div>

        {/* Current Phone Number Card (if exists) */}
        {userPhoneInfo && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <PhoneIcon className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Verified Phone Number</h2>
              <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircleIconSolid className="w-4 h-4 mr-1" />
                Active
              </span>
            </div>
            
            <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                  <div className="text-sm text-gray-500">Phone Number</div>
                  <div className="font-medium">{userPhoneInfo.phoneNumber}</div>
              </div>
                
                <div className="mt-2 sm:mt-0">
                  <div className="text-sm text-gray-500">Carrier</div>
                  <div className="font-medium">
                    {carriers.find(c => c.id === userPhoneInfo.carrier)?.name || userPhoneInfo.carrier || 'Unknown'}
            </div>
          </div>

                {userPhoneInfo.verifiedAt && (
                  <div className="mt-2 sm:mt-0">
                    <div className="text-sm text-gray-500">Verified On</div>
                    <div className="font-medium">
                      {userPhoneInfo.verifiedAt.toLocaleDateString()}
                    </div>
            </div>
                )}
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                This phone number will receive SMS alerts when your watched classes become available.
              </div>
              
              <button
                type="button"
                onClick={handleResetVerification}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                Change phone number
              </button>
            </div>
          </div>
        )}

        {/* Settings Form - show only if user doesn't have a phone number or is changing it */}
        {(!userPhoneInfo || !verificationSuccess) && (
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <PhoneIcon className="w-6 h-6 text-maroon" />
              <h2 className="text-xl font-semibold text-gray-900">Phone Number Settings</h2>
                {verificationSuccess && (
                  <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIconSolid className="w-4 h-4 mr-1" />
                    Verified
                  </span>
                )}
            </div>
            <div className="space-y-4">
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="flex">
                <input
                  type="tel"
                  value={phoneNumber}
                        onChange={(e) => {
                          // Only allow digits (no spaces, dashes, or other characters)
                          const digitsOnly = e.target.value.replace(/\D/g, '');
                          // Limit to 10 digits
                          const formattedNumber = digitsOnly.slice(0, 10);
                          setPhoneNumber(formattedNumber);
                        }}
                        onPaste={(e) => {
                          // Handle paste events to strip any non-digit characters
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData('text');
                          const digitsOnly = pastedText.replace(/\D/g, '');
                          const formattedNumber = digitsOnly.slice(0, 10);
                          setPhoneNumber(formattedNumber);
                        }}
                        maxLength={10}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon ${
                          verificationSuccess ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}
                        placeholder="10-digit number (e.g. 1234567890)"
                        disabled={verificationSuccess}
                      />
                      {!verificationSent && !verificationSuccess && (
                        <button
                          type="button"
                          onClick={sendVerificationCode}
                          disabled={isSubmitting || !phoneNumber || phoneNumber.length !== 10 || !carrier}
                          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {isSubmitting ? 'Sending...' : 'Verify'}
                        </button>
                      )}
                      {verificationSuccess && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your 10-digit phone number with no spaces or dashes (e.g. 1234567890).
                  </p>
              </div>
                
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carrier</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white ${
                      verificationSuccess ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                    disabled={verificationSuccess}
                >
                  <option value="">Select your carrier</option>
                  {carriers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
                
                {/* Verification code input field - only show when code has been sent */}
                {verificationSent && !verificationSuccess && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                        placeholder="Enter 5-character code"
                        maxLength={5}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                      />
                      <button
                        type="button"
                        onClick={verifyCode}
                        disabled={verificationCode.length !== 5}
                        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                      >
                        Confirm
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      A 5-character verification code was sent to your phone. Please enter it above.
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Sending to: {phoneNumber}
                      {carriers.find(c => c.id === carrier)?.domain}
                    </p>
            </div>
                )}
                
                {/* Display error messages */}
                {verificationError && (
                  <div className="text-red-600 text-sm flex items-center">
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    {verificationError}
          </div>
                )}
                
                <p className="text-sm text-gray-500 mt-2">
                  We'll send text message alerts to your phone when a class you're monitoring becomes available.
                  This requires verifying your phone number to ensure you receive the notifications.
                </p>
              </div>
            </div>

            {/* Verification Success Message */}
            {verificationSuccess && successMessage && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
            )}

          {/* Save Button */}
          <button
            type="submit"
              disabled={!verificationSuccess || isSubmitting}
              className="w-full px-4 py-3 bg-maroon text-white rounded-lg hover:bg-maroon/90 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
              {isSubmitting ? 'Saving...' : 'Save Verified Phone Number'}
          </button>
        </form>
        )}
      </div>
    </div>
  );
};

export default Settings; 