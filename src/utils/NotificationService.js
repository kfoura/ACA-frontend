/**
 * Notification service for handling SMS and other notifications
 */

const API_URL = 'https://api.aggieclassalert.com';
const idToken = localStorage.getItem('token');
/**
 * Send an SMS notification
 * @param {Object|string} optionsOrPhoneNumber - Either notification options object or phone number string
 * @param {string} [carrier] - The carrier (only used if first param is phone number)
 * @param {string} [message] - The message (only used if first param is phone number)
 * @param {string} [emailParam] - The user's email (only used if first param is phone number)
 * @returns {Promise} - A promise that resolves when the SMS is sent
 */
export const sendSMS = (options = {}) => {
  console.log('sendSMS called with options:', options);
  const { phoneNumber, carrier, message, email, onSuccess, onError } = options;
  
  const payload = {};
  if (phoneNumber) payload.phone_number = phoneNumber;
  if (carrier) payload.carrier = carrier;
  if (message) payload.message = message;
  if (email) payload.email = email;
  
  //console.log('Sending SMS with payload:', payload);
  //console.log('API URL:', `${API_URL}/api/send-sms`);

  return fetch(`${API_URL}/api/send-sms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(payload),
  })
    .then(response => {
      //console.log('SMS API response status:', response.status);
      return response.json();
    })
    .then(data => {
      //console.log('SMS API response data:', data);
      if (data.success) {
        //console.log('SMS sent successfully');
        if (onSuccess) onSuccess(data);
        return data;
      } else {
        //console.error('SMS sending failed:', data.error);
        if (onError) onError(data.error);
        throw new Error(data.error);
      }
    })
    .catch(error => {
      //console.error('Error sending SMS:', error);
      if (onError) onError(error.message || 'Unknown error');
      throw error;
    });
};

/**
 * Format and send a class availability notification via SMS
 * @param {Object|string} optionsOrPhoneNumber - Either notification options object or phone number string
 * @param {string} [carrier] - The carrier (only used if first param is phone number)
 * @param {string} [crn] - The CRN (only used if first param is phone number)
 * @param {string} [emailParam] - The user's email (only used if first param is phone number)
 * @returns {Promise} - A promise that resolves when the SMS is sent
 */
export const sendClassAvailabilityNotification = (options = {}) => {
  //console.log('sendClassAvailabilityNotification called with options:', options);
  const { email, crn, department, courseCode, section, onSuccess, onError } = options;
  
  // Format the SMS message
  let message = `CRN ${crn} is available`;
  if (department && courseCode) {
    message += ` (${department} ${courseCode}`;
    if (section) message += ` Section ${section}`;
    message += `)`;
  }
  
  // Create payload for the send-sms endpoint
  const payload = {
    email: email,
    message: message,
    subject: 'Aggie Class Alert'
  };
  
  //console.log('Sending class availability notification with payload:', payload);
  //console.log('API URL:', `${API_URL}/api/send-sms`);

  return fetch(`${API_URL}/api/send-sms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(payload),
  })
    .then(response => {
      //console.log('Class notification API response status:', response.status);
      return response.json();
    })
    .then(data => {
      //console.log('Class notification API response data:', data);
      if (data.success) {
        //console.log('Class notification sent successfully');
        if (onSuccess) onSuccess(data);
        return data;
      } else {
        //console.error('Class availability notification failed:', data.error);
        if (onError) onError(data.error);
        throw new Error(data.error);
      }
    })
    .catch(error => {
      //console.error('Error sending class availability notification:', error);
      if (onError) onError(error.message || 'Unknown error');
      throw error;
    });
};

const NotificationService = {
  sendSMS,
  sendClassAvailabilityNotification
};

export default NotificationService; 
