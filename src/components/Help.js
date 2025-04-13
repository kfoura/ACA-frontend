import React from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-maroon mb-8">Help Center</h1>
      
      <div className="space-y-12">
        {/* What is AggieClassAlert Section */}
        <section>
          <h2 className="text-2xl font-semibold text-maroon mb-4">What is AggieClassAlert?</h2>
          <p className="text-gray-700 mb-4">
            AggieClassAlert is a service designed to help Texas A&M University students secure seats in their desired classes. 
            It monitors course availability and notifies you when a seat becomes available, giving you the best chance to register.
          </p>
          <p className="text-gray-700">
            Our service works by continuously checking the availability of your selected courses and sending you immediate notifications 
            when a seat opens up, allowing you to quickly register before others.
          </p>
        </section>

        {/* How to Use AggieClassAlert Section */}
        <section>
          <h2 className="text-2xl font-semibold text-maroon mb-4">How to Use AggieClassAlert</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-maroon mb-2">1. Create an Account</h3>
              <p className="text-gray-700">
                Sign up using your Google account to get started with AggieClassAlert.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-maroon mb-2">2. Add Course Alerts</h3>
              <p className="text-gray-700">
                Go to the <Link to="/search" className="text-maroon hover:underline">Search Professors</Link> page to find your desired course. 
                Once you've found the course, click on the "Add Alert" button to start monitoring it.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-maroon mb-2">3. Receive Notifications</h3>
              <p className="text-gray-700">
                When a seat becomes available, you'll receive an email notification. You can also enable SMS notifications in your 
                <Link to="/settings" className="text-maroon hover:underline"> Settings</Link> for faster alerts.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-maroon mb-2">4. Register Quickly</h3>
              <p className="text-gray-700">
                Once you receive a notification, log into Howdy as quickly as possible to register for the available seat.
              </p>
            </div>
          </div>
        </section>

        {/* Managing Your Alerts Section */}
        <section>
          <h2 className="text-2xl font-semibold text-maroon mb-4">Managing Your Alerts</h2>
          <p className="text-gray-700 mb-4">
            You can view and manage all your active alerts on the <Link to="/my-alerts" className="text-maroon hover:underline">My Alerts</Link> page. 
            Here you can:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>View all your active course alerts</li>
            <li>Remove alerts for courses you no longer need</li>
            <li>See the status of each alert (active, notified, etc.)</li>
            <li>Add new alerts directly from this page</li>
          </ul>
        </section>

        {/* SMS Notifications Section */}
        <section>
          <h2 className="text-2xl font-semibold text-maroon mb-4">SMS Notifications</h2>
          <p className="text-gray-700 mb-4">
            For faster notifications, you can enable SMS alerts in your <Link to="/settings" className="text-maroon hover:underline">Settings</Link>. 
            This requires:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Adding your phone number</li>
            <li>Selecting your carrier</li>
            <li>Verifying your phone number with a code</li>
            <li>Enabling SMS notifications for specific alerts</li>
          </ol>
          <p className="text-gray-700 mt-4">
            SMS notifications are sent through email-to-SMS gateways and are supported by major carriers including Verizon, AT&T, T-Mobile, and others.
          </p>
        </section>

        {/* Professor Search Section */}
        <section>
          <h2 className="text-2xl font-semibold text-maroon mb-4">Professor Search</h2>
          <p className="text-gray-700 mb-4">
            The <Link to="/search" className="text-maroon hover:underline">Search Professors</Link> feature helps you find the best professors for your courses by:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Showing historical GPA data for each professor</li>
            <li>Displaying which professors are teaching in the upcoming semester</li>
            <li>Providing RateMyProfessor ratings when available</li>
            <li>Showing section availability and meeting times</li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-semibold text-maroon mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-maroon mb-2">How often does AggieClassAlert check for available seats?</h3>
              <p className="text-gray-700">
                We check for available seats every minute to ensure you get notifications as quickly as possible.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-maroon mb-2">Will I be notified if I get into a class?</h3>
              <p className="text-gray-700">
                Yes, once you successfully register for a class, the alert will be automatically deactivated and you'll receive a confirmation notification.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-maroon mb-2">Can I set up alerts for multiple courses?</h3>
              <p className="text-gray-700">
                Yes, you can set up alerts for as many courses as you need. There is no limit to the number of alerts you can create.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-maroon mb-2">Is AggieClassAlert affiliated with Texas A&M University?</h3>
              <p className="text-gray-700">
                No, AggieClassAlert is an independent service created by students to help fellow Aggies. We are not officially affiliated with Texas A&M University.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-semibold text-maroon mb-4">Need More Help?</h2>
          <p className="text-gray-700">
            If you have any questions or need assistance, please contact us at <a href="mailto:aggieclassalert@gmail.com" className="text-maroon hover:underline">aggieclassalert@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Help; 