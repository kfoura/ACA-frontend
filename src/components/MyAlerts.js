import React, { useState, useEffect } from 'react';
import { BellIcon, TrashIcon, PencilIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { PhoneIcon as PhoneIconSolid } from '@heroicons/react/24/solid';
import SimpleLogin from './SimpleLogin';
import { useAuth } from '../context/AuthContext';
import { sendClassAvailabilityNotification } from '../utils/NotificationService';

const API_URL = 'http://localhost:5001';

const MyAlerts = () => {
  const { user, logout } = useAuth(); // Get user and logout from Auth context
  const [alerts, setAlerts] = useState([]);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [newCRN, setNewCRN] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sampleCRNs, setSampleCRNs] = useState(null);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [isFilteringByEmail, setIsFilteringByEmail] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userPhoneVerified, setUserPhoneVerified] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [userPhoneCarrier, setUserPhoneCarrier] = useState('');
  const [phoneToggleLoading, setPhoneToggleLoading] = useState(false);
  const [enableSMS, setEnableSMS] = useState(true); // Default to true for user convenience

  // Update the useEffect to handle both token-based and localStorage email
  useEffect(() => {
    // First check for Google Auth user
    if (user && user.email) {
      //console.log('Google Auth user detected:', user.email);
      // The token login will have already created/synced the user in MongoDB
      // We just need to set the UI state
      setIsLoggedIn(true);
      setEmail(user.email);
      setEmailFilter(user.email);
      fetchAlertsByEmail(user.email);
      checkUserPhoneStatus(user.email);
    } else {
      // Fall back to localStorage for email-only login
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) {
        checkUserInMongoDB(savedEmail);
        checkUserPhoneStatus(savedEmail);
      } else {
        fetchAlerts();
      }
    }
  }, [user]);

  // Check if the user has a verified phone number
  const checkUserPhoneStatus = async (userEmail) => {
    if (!userEmail) return;
    
    try {
      const response = await fetch(`${API_URL}/api/users/profile?email=${encodeURIComponent(userEmail)}`);
      
      if (response.ok) {
        const userData = await response.json();
        
        // Check if the user has a verified phone number
        if (userData.phone_number && userData.phone_verified) {
          setUserPhoneVerified(true);
          setUserPhoneNumber(userData.phone_number);
          setUserPhoneCarrier(userData.phone_carrier || '');
          //console.log(`User has verified phone: ${userData.phone_number}`);
        } else {
          setUserPhoneVerified(false);
          //console.log('User does not have a verified phone number');
        }
      }
    } catch (error) {
      console.error('Error checking user phone status:', error);
    }
  };

  const checkUserInMongoDB = async (email) => {
    try {
      //console.log(`Checking if user ${email} exists in MongoDB...`);
      const response = await fetch(`${API_URL}/api/users/check/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        //console.log('User check response:', data);
        
        if (data.exists) {
          //console.log(`User ${email} exists in MongoDB!`);
          setEmail(email);
          setEmailFilter(email);
          setIsLoggedIn(true);
          fetchAlertsByEmail(email);
        } else {
          //console.log(`User ${email} not found in MongoDB, will try to create account`);
          // Try to create the user through login endpoint
          createUserViaLogin(email);
        }
      } else {
        console.error('Error checking user in MongoDB');
        setError('Error verifying user. Please try again.');
        localStorage.removeItem('userEmail');
        fetchAlerts();
      }
    } catch (error) {
      console.error('Error checking MongoDB user:', error);
      setError('Error connecting to the database. Please try again.');
      localStorage.removeItem('userEmail');
      fetchAlerts();
    }
  };

  const createUserViaLogin = async (email) => {
    try {
      //console.log(`Attempting to create user via login API: ${email}`);
      
      // Force API call to ensure user is created/updated in MongoDB
      const loginUrl = `${API_URL}/api/users/login`;
      //console.log(`Login URL: ${loginUrl}`);
      //console.log(`Sending data: ${JSON.stringify({ email })}`);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      //console.log(`Login response status: ${response.status}`);
      const data = await response.json();
      //console.log('Login API response:', data);
      
      if (response.ok) {
        //console.log('User creation/login successful');
        
        // Save to localStorage
        localStorage.setItem('userEmail', email);
        
        // Update UI state
        setEmail(email);
        setEmailFilter(email);
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        fetchAlertsByEmail(email);
        
        // Show success message
        setSuccessMessage('Login successful!');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Verify user was created by checking the database
        setTimeout(() => {
          //console.log('Verifying user was created in database...');
          fetch(`${API_URL}/api/users/check/${encodeURIComponent(email)}`)
            .then(res => res.json())
            .then(checkResult => {
              //console.log('User verification result:', checkResult);
            })
            .catch(err => console.error('Error verifying user:', err));
        }, 1000);
      } else {
        console.error('Failed to create user via login:', data);
        setError(data.error || 'Failed to create user account. Please try again.');
        // Don't remove from localStorage here - give a chance to retry
      }
    } catch (error) {
      console.error('Error in createUserViaLogin:', error);
      setError('Error creating user account. Please check your connection and try again.');
    }
  };

  // Fetch existing alerts from backend
  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/alerts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
        
        // Add console logging for class availability
        console.log('--- Class Availability Status ---');
        data.forEach(alert => {
          console.log(`CRN ${alert.CRN} (${alert.Term}): ${alert.status ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
        });
        console.log('-------------------------------');
      } else {
        console.error('Failed to fetch alerts');
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchSampleCRNs = async () => {
    setLoadingSamples(true);
    try {
      const response = await fetch(`${API_URL}/api/sample-crns`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSampleCRNs(data.samples);
      } else {
        console.error('Failed to fetch sample CRNs');
      }
    } catch (error) {
      console.error('Error fetching sample CRNs:', error);
    } finally {
      setLoadingSamples(false);
    }
  };

  const handleAddAlert = async (e) => {
    e.preventDefault();
    if (!newCRN) {
      setError('CRN is required');
      return;
    }

    // Ensure we have an email to associate with the alert
    if (!isLoggedIn && (!email || !email.includes('@'))) {
      setError('Please login or enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    //console.log(`Attempting to add alert for CRN: ${newCRN}`);

    try {
      // If not logged in, login/register the user first
      if (!isLoggedIn && email) {
        const loginResponse = await fetch(`${API_URL}/api/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          // Save email to localStorage for session tracking
          localStorage.setItem('userEmail', email);
          setIsLoggedIn(true);
          //console.log(`User logged in before adding alert: ${email}`);
        } else {
          console.error('Error logging in user before adding alert');
        }
      }

      // Now add the alert
      const response = await fetch(`${API_URL}/api/add-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crn: newCRN,
          email: email,
          use_phone: userPhoneVerified && enableSMS // Only enable if phone is verified AND checkbox is checked
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error('Error parsing JSON response:', err);
        setError('Invalid response from server');
        setLoading(false);
        return;
      }

      //console.log('Alert response:', data);

      if (response.ok) {
        setSuccessMessage(data.message || 'Alert added successfully');
        setNewCRN('');
        
        // Close the modal
        setShowAddAlert(false);
        
        // Refresh the alerts list
        if (isLoggedIn || email) {
          fetchAlertsByEmail(email);
        } else {
          fetchAlerts();
        }
        
        // Show a message about the phone notification status
        if (userPhoneVerified) {
          setSuccessMessage(data.phone_available 
            ? 'Alert added with SMS notifications enabled!' 
            : 'Alert added successfully, but SMS notifications require a verified phone number');
        }
      } else {
        setError(data.error || 'Failed to add alert');
      }
    } catch (error) {
      console.error('Error adding alert:', error);
      setError('An error occurred while adding the alert');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (crn, term, email) => {
    if (!window.confirm(`Are you sure you want to delete the alert for CRN ${crn}?`)) {
      return;
    }
    
    //console.log(`Attempting to delete alert for CRN ${crn} (Term: ${term})`);
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/alerts/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crn: crn.toString(),
          term: term.toString(),
          email: email
        })
      });
      
      const data = await response.json();
      //console.log(data);
      if (response.ok) {
        //console.log(`✅ Successfully deleted alert for CRN ${crn}`);
        setDeleteMessage(data.message);
        setTimeout(() => setDeleteMessage(''), 3000); // Clear message after 3 seconds
        fetchAlerts(); // Refresh the alerts list
      } else {
        console.error(`❌ Error deleting alert for CRN ${crn}:`, data.error);
        setError(data.error || 'Failed to delete alert');
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      setError('An error occurred while deleting the alert');
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchAlertsByEmail = async (email) => {
    if (!email) {
      setError('Email address is required for filtering');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/alerts/by-email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
        setIsFilteringByEmail(true);
        
        // Add console logging for class availability
        console.log(`--- Class Availability Status for ${email} ---`);
        data.forEach(alert => {
          console.log(`CRN ${alert.CRN} (${alert.Term}): ${alert.status ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
        });
        console.log('-------------------------------');
      } else {
        console.error('Failed to fetch alerts by email');
        setError('Failed to retrieve alerts for this email');
      }
    } catch (error) {
      console.error('Error fetching alerts by email:', error);
      setError('An error occurred while retrieving alerts');
    } finally {
      setLoading(false);
    }
  };

  const clearEmailFilter = () => {
    setIsFilteringByEmail(false);
    fetchAlerts();
    setEmailFilter('');
  };

  const handleLoginClick = () => {
    //console.log('Login button clicked');
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (email) => {
    //console.log(`Login success called with email: ${email}`);
    
    // Make a direct API call to ensure the user is in MongoDB
    const loginUrl = `${API_URL}/api/users/login`;
    //console.log(`Making direct API call to ${loginUrl}`);
    
    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })
    .then(response => {
      //console.log('Login API response status:', response.status);
      return response.json();
    })
    .then(data => {
      //console.log('Login API response data:', data);
      
      if (data.success) {
        //console.log('User successfully added/updated in MongoDB');
        // Update state and UI
        setEmail(email);
        setEmailFilter(email);
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        fetchAlertsByEmail(email);
        
        // Show success message
        setSuccessMessage('Login successful!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.error('Error in login API response:', data);
        setError(data.error || 'Failed to login. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error in login API call:', error);
      setError('Error connecting to the server. Please try again.');
    });
  };

  const handleLogout = () => {
    //console.log('Logging out user');
    
    // For direct email login
    localStorage.removeItem('userEmail');
    
    // For Google Auth (using AuthContext)
    if (logout) {
      logout();
      //console.log('Logged out via Auth context');
    }
    
    // Reset local state
    setIsLoggedIn(false);
    setEmail('');
    setEmailFilter('');
    clearEmailFilter();
    setSuccessMessage('Logged out successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Toggle phone notifications for an alert
  const togglePhoneNotification = async (crn, term, currentUsePhone) => {
    if (!userPhoneVerified) {
      alert('You need to verify a phone number in Settings before enabling SMS notifications');
      return;
    }
    
    setPhoneToggleLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Only send a test notification if we're enabling notifications
      if (!currentUsePhone) {
        try {
          //console.log('Sending test notification...');
          // Always include email and sample course details for better message formatting
          await sendClassAvailabilityNotification({
            email: email,
            crn: crn,
            department: 'TEST',
            courseCode: '101',
            section: '500',
            term: term,
            onSuccess: (data) => console.log('Test notification sent:', data),
            onError: (error) => console.error('Test notification error:', error)
          });
          //console.log('Test SMS notification sent successfully');
        } catch (smsError) {
          console.error('Failed to send test SMS notification:', smsError);
          alert('Failed to send test SMS. Please check your phone number and carrier settings.');
          setPhoneToggleLoading(false);
          return;
        }
      }
      
      // Call API to update the alert with the new use_phone setting
      const response = await fetch(`${API_URL}/api/add-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crn: crn,
          term: term,
          email: email,
          use_phone: !currentUsePhone // Toggle the current value
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        //console.log(`Successfully ${!currentUsePhone ? 'enabled' : 'disabled'} SMS notifications for CRN ${crn}`);
        
        // Update the alerts in the state
        setAlerts(alerts.map(alert => {
          if (alert.CRN === crn && alert.Term === term) {
            return { ...alert, use_phone: !currentUsePhone };
          }
          return alert;
        }));
        
        // If enabling notifications, show a success message about the test
        if (!currentUsePhone) {
          setSuccessMessage(`SMS notifications enabled for CRN ${crn}. A test message was sent to your phone.`);
        } else {
          setSuccessMessage(`SMS notifications disabled for CRN ${crn}.`);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.error('Error updating alert:', data.error);
        setError(data.error || 'Failed to update notification settings');
      }
    } catch (error) {
      console.error('Error toggling phone notification:', error);
      setError('An error occurred while updating notification settings');
    } finally {
      setPhoneToggleLoading(false);
    }
  };

  // Handle the alert table to include a phone notification toggle column
  const renderAlertTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-6">CRN</th>
              <th className="py-3 px-6">Term</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Last Checked</th>
              <th className="py-3 px-6">SMS</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <tr key={index} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{alert.CRN}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{alert.Term}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alert.status ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{alert.email || 'Not provided'}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {alert.last_checked 
                      ? new Date(alert.last_checked * 1000).toLocaleString() 
                      : 'Not checked yet'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <button 
                      className={`p-1 rounded-full transition-colors ${
                        userPhoneVerified 
                          ? (alert.use_phone ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100') 
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                      onClick={() => userPhoneVerified && togglePhoneNotification(alert.CRN, alert.Term, alert.use_phone)}
                      disabled={!userPhoneVerified || phoneToggleLoading}
                      title={userPhoneVerified ? (alert.use_phone ? 'Disable SMS notifications' : 'Enable SMS notifications') : 'Verify your phone number in Settings first'}
                    >
                      {alert.use_phone ? <PhoneIconSolid className="w-5 h-5" /> : <PhoneIcon className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="flex justify-end gap-3">
                      <button 
                        className="p-1 hover:bg-red-50 rounded-full transition-colors"
                        onClick={() => handleDeleteAlert(alert.CRN, alert.Term, alert.email)}
                        disabled={isDeleting}
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No alerts found. Add a new alert to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Alerts</h1>
            <p className="text-gray-600">Manage your class availability alerts</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAddAlert(true)}
              className="px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon/90 transition-colors flex items-center gap-2"
            >
              <BellIcon className="w-5 h-5" />
              New Alert
            </button>
          </div>
        </div>

        {/* Phone Status Indicator - show if user has a verified phone */}
        {userPhoneVerified && (
          <div className="mb-6 p-3 bg-blue-50 text-blue-700 rounded-lg">
            <div className="flex items-center">
              <PhoneIconSolid className="w-5 h-5 mr-2" />
              <span>Your verified phone ({userPhoneNumber}) can receive SMS alerts. Toggle SMS for each alert in the table below.</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {(successMessage || deleteMessage) && (
          <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg transition-opacity">
            {successMessage || deleteMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Render the updated table with the SMS column */}
        {renderAlertTable()}
        
        {/* Add Alert Modal */}
        {showAddAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Alert</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleAddAlert}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email for Notifications
                  </label>
                  {isLoggedIn ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700"
                        readOnly
                      />
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Logged In</span>
                    </div>
                  ) : (
                    <>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        We'll email you when your class becomes available
                      </p>
                    </>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="crn" className="block text-sm font-medium text-gray-700 mb-1">
                    CRN Number
                  </label>
                  <input
                    type="text"
                    id="crn"
                    value={newCRN}
                    onChange={(e) => setNewCRN(e.target.value)}
                    placeholder="Enter CRN (e.g., 12345)"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                    required
                  />
                  <div className="mt-1 flex flex-col">
                    <p className="text-xs text-gray-500">
                      Enter a valid CRN for Fall 2025 or Summer 2025. For example, try 47550.
                    </p>
                    <button 
                      type="button" 
                      onClick={fetchSampleCRNs} 
                      className="text-xs text-maroon mt-1 underline"
                      disabled={loadingSamples}
                    >
                      {loadingSamples ? 'Loading samples...' : 'Show me some valid CRNs to try'}
                    </button>
                    
                    {sampleCRNs && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-md">
                        <p className="text-xs font-medium text-gray-700 mb-1">Sample CRNs:</p>
                        {Object.entries(sampleCRNs).map(([term, crns]) => (
                          <div key={term} className="mb-1">
                            <p className="text-xs text-gray-600">Term {term}:</p>
                            <div className="flex flex-wrap gap-1">
                              {crns.map(crn => (
                                <button
                                  key={crn}
                                  type="button"
                                  onClick={() => setNewCRN(crn)}
                                  className="px-2 py-1 text-xs bg-gray-200 hover:bg-maroon hover:text-white rounded transition-colors"
                                >
                                  {crn}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {userPhoneVerified && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="enable-sms"
                        className="h-4 w-4 text-maroon focus:ring-maroon border-gray-300 rounded"
                        checked={enableSMS}
                        onChange={(e) => setEnableSMS(e.target.checked)}
                      />
                      <label htmlFor="enable-sms" className="text-sm text-gray-700">
                        Enable SMS notifications to {userPhoneNumber}
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 ml-6">
                      You'll receive both email and text messages when the class becomes available
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddAlert(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon/90 transition-colors flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Alert'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAlerts; 