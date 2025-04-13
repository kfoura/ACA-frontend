import React from 'react';

const HeroSection = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/tamu-campus-entrance-aerial-sunset.jpeg')`,
        }}
      />
      {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative h-full flex items-center px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
          {/* Left Column - Text Content */}
          <div className="flex flex-col items-start">
            {/* Small heading */}
            <p className="text-white/80 text-lg mb-4">AGGIECLASSALERT</p>
            
            {/* Main heading - split into lines */}
            <div className="space-y-2">
              <h1 className="text-7xl font-medium text-white">Never miss a</h1>
              <h1 className="text-7xl font-medium text-white">class that</h1>
              <h1 className="text-7xl font-medium text-white">matters.</h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl text-white/70 mt-6 max-w-xl">
              Get instant notifications when your desired Texas A&M classes become available.
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-8 mt-12">
              <button 
                className="px-8 py-3 bg-maroon text-white rounded-lg font-medium hover:bg-maroon/90 transition-colors shadow-lg"
                onClick={() => window.location.href = '/my-alerts'}
              >
                Get Started
              </button>
              <a href="help" className="text-white flex items-center gap-2 group">
                Learn More
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

            {/* Right Column - Brief Features */}
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-[1px] p-8 rounded-xl border border-white/20 shadow-xl w-full">
                <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-maroon/20 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Set Up Alerts</h3>
                      <p className="text-white/80 text-sm">Choose your desired classes and set up SMS or email notifications</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-maroon/20 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Find the Best Professors</h3>
                      <p className="text-white/80 text-sm">Search and compare professors using our comprehensive rating system</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-maroon/20 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Get Instant Updates</h3>
                      <p className="text-white/80 text-sm">Receive immediate notifications when spots open up in your classes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <button 
          onClick={scrollToFeatures}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
          aria-label="Scroll to features"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      {/* Features Section */}
      <div id="features-section" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Get Your Classes</h2>
            <p className="text-xl text-gray-600">Stay ahead of the game with our comprehensive notification system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* SMS Notifications */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-maroon/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant SMS Alerts</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="h-6 w-6 text-maroon flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Receive text messages within seconds of a spot opening</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-6 w-6 text-maroon flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Direct links to registration in every message</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-6 w-6 text-maroon flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Never miss a notification with our reliable SMS system</span>
                </li>
              </ul>
            </div>

            {/* Email Notifications */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-maroon/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Detailed Email Updates</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="h-6 w-6 text-maroon flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Comprehensive class information in every email</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-6 w-6 text-maroon flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Track multiple classes with organized notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-6 w-6 text-maroon flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Backup notifications ensure you never miss an opening</span>
                </li>
              </ul>
            </div>

            {/* Professor Search */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-maroon/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Professor Search</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="h-6 w-6 text-maroon flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access detailed professor ratings and reviews</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-6 w-6 text-maroon flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Filter by teaching style and course difficulty</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-6 w-6 text-maroon flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Find the perfect professor for your learning style</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Professor Search Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Professor</h2>
            <p className="text-xl text-gray-600">Make informed decisions with comprehensive professor data from multiple sources.</p>
          </div>

          {/* Step 1: Professor Overview */}
          <div className="mb-24">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <div className="bg-gray-900 text-white text-sm px-3 py-1 rounded mb-2">
                            Click for professor details
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">AGGIE S</h3>
                        </div>
                        <span className="bg-maroon text-white text-sm px-3 py-1 rounded-full">HONORS</span>
                        <span className="text-gray-600 text-sm">CSCE</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-gray-900">1.25</span>
                          <span className="text-sm text-gray-500">Overall GPA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-gray-900">1.2</span>
                          <span className="text-sm text-gray-500">RMP Score</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                      <span className="font-semibold">Teaching Next Semester</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-96 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Combined Ratings</h3>
                <p className="text-gray-600">Get the full picture with both official grade distributions and RateMyProfessor scores in one place.</p>
              </div>
            </div>
          </div>

          {/* Step 2: Student Reviews */}
          <div className="mb-24">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">RateMyProfessor Data</h3>
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-maroon">1.8</div>
                      <div className="text-sm text-gray-600">Overall Rating</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-maroon">15%</div>
                      <div className="text-sm text-gray-600">Would Take Again</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-maroon">4.9</div>
                      <div className="text-sm text-gray-600">Difficulty</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Common Tags from Students</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Amazing lectures</span>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Caring</span>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Clear grading criteria</span>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Get ready to read</span>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Gives good feedback</span>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Graded by few things</span>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Hilarious</span>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Inspirational</span>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Lecture heavy</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-96 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Student Experiences</h3>
                <p className="text-gray-600">See what other students are saying through detailed ratings and helpful tags that describe the teaching style and course expectations.</p>
              </div>
            </div>
          </div>

          {/* Step 3: Section Alerts */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Known Sections</h3>
                    {/* <span className="bg-maroon/10 text-maroon text-sm px-3 py-1 rounded-full font-medium">
                      Unlimited Alerts Available
                    </span> */}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="font-semibold">Section 503</span>
                          <span className="text-sm text-gray-600">TR 09:35 AM-10:50 AM</span>
                          <span className="text-sm text-gray-600">ZACH 310</span>
                        </div>
                        <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">Closed</span>
                      </div>
                      <div className="bg-maroon/90 text-white px-4 py-2 rounded-lg select-none">
                        Add Alert
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="font-semibold">Section 505</span>
                          <span className="text-sm text-gray-600">TR 08:00 AM-09:15 AM</span>
                          <span className="text-sm text-gray-600">ZACH 310</span>
                        </div>
                        <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Open</span>
                      </div>
                      <div className="bg-maroon/90 text-white px-4 py-2 rounded-lg select-none">
                        Add Alert
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-maroon/5 rounded-lg border border-maroon/10">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-maroon flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-maroon">
                        <span className="font-semibold">No limits on alerts!</span> Set up as many alerts as you need across different sections and professors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-96 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Set Up Alerts</h3>
                <p className="text-gray-600">Found your ideal professor? Set up alerts for their sections and get notified immediately when spots become available. No restrictions on how many alerts you can create!</p>
              </div>
            </div>
          </div>

          {/* New Unlimited Alerts Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-1">
                {/* Heading Section */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">My Alerts</h2>
                  <p className="text-gray-600 mt-2">Manage your class availability alerts</p>
                </div>

                <div className="flex gap-6">
                  <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* SMS Info Banner */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <p className="text-sm text-blue-700">
                        Your verified phone (123456789) can receive SMS alerts. Toggle SMS for each alert in the table below.
                      </p>
                    </div>

                    {/* Success Message */}
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 text-green-700 text-sm">
                      Alert added with SMS notifications enabled!
                    </div>

                    {/* Alerts Table */}
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRN</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TERM</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST CHECKED</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SMS</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">47550</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">202531</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">Not Available</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">aggieclassalert@gmail.com</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4/11/2025, 9:43:35 PM</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">48123</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">202531</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">Closed</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">aggieclassalert@gmail.com</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4/11/2025, 9:43:35 PM</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">45789</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">202531</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Open</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">aggieclassalert@gmail.com</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4/11/2025, 9:43:35 PM</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">46234</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">202531</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">Not Available</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">aggieclassalert@gmail.com</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4/11/2025, 9:43:35 PM</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">49876</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">202531</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">Closed</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">aggieclassalert@gmail.com</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4/11/2025, 9:43:35 PM</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="w-80 bg-maroon/5 rounded-xl p-6 border border-maroon/10 sticky top-6 self-start">
                    <div className="flex items-center gap-3 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-maroon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h4 className="text-lg font-bold text-gray-900">Unlimited Alert Tracking</h4>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-maroon flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Track unlimited sections across all your courses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-maroon flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">No restrictions on the number of alerts you can set</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-maroon flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Get notified instantly for all your tracked sections</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right side description */}
                {/* <div className="lg:w-96 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Multiple Ways to Track</h3>
                  <p className="text-gray-600">Search for sections to track or add them directly from professor profiles. Get instant notifications when spots open up in any of your tracked sections.</p>
                </div> */}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button 
              className="bg-maroon text-white px-8 py-4 rounded-lg font-medium hover:bg-maroon/90 transition-colors inline-flex items-center gap-2"
              onClick={() => window.location.href = '/search'}
            >
              Start Your Alerts Today
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default HeroSection; 