import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, StarIcon, AcademicCapIcon, AdjustmentsHorizontalIcon, XMarkIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import logProfessorSearchData from '../utils/professorSearchLogger';

const API_URL = 'http://localhost:5001';

const Search = () => {
  const [department, setDepartment] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [displayDepartment, setDisplayDepartment] = useState('');
  const [displayCourseCode, setDisplayCourseCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [professors, setProfessors] = useState([]);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState('overall'); // Default sort by overall GPA
  const [searchStats, setSearchStats] = useState({ 
    total_professors: 0, 
    fall_professors: 0,
    has_fall_teachers: false
  });
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [sectionData, setSectionData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRmpDebug, setShowRmpDebug] = useState(false);
  const [rmpModuleAvailable, setRmpModuleAvailable] = useState(null);
  const [alertStatus, setAlertStatus] = useState({});
  const [email, setEmail] = useState('');
  const [includeGalveston, setIncludeGalveston] = useState(false);

  const renderStars = (rating) => {
    return [...Array(4)].map((_, index) => {
      // Calculate the fill percentage for this star (0 to 1)
      const starPosition = index + 1; // Star position (1-4)
      const distanceFromRating = starPosition - rating;
      
      if (distanceFromRating <= 0) {
        // Fully filled star
        return <StarIconSolid key={index} className="w-5 h-5 text-yellow-400" />;
      } else if (distanceFromRating > 0 && distanceFromRating < 1) {
        // Partially filled star - handle quarter increments
        const fillPercentage = Math.round((1 - distanceFromRating) * 4) / 4; // Round to nearest quarter
        
        return (
          <span key={index} className="relative inline-block w-5 h-5">
            {/* Background star (empty) */}
            <StarIcon className="absolute w-5 h-5 text-gray-300" />
            
            {/* Foreground star (partially filled) - clip path for partial fill */}
            <div className="absolute w-5 h-5 overflow-hidden" style={{ width: `${fillPercentage * 100}%` }}>
              <StarIconSolid className="w-5 h-5 text-yellow-400" />
            </div>
          </span>
        );
      } else {
        // Empty star
        return <StarIcon key={index} className="w-5 h-5 text-gray-300" />;
      }
    });
  };

  const sortProfessors = (profs, sortMethod) => {
    // First filter out university/institution names and course names (not actual professors)
    const actualProfessors = profs.filter(p => {
      // Skip entries that are likely institutions or courses, not professors
      const nonProfessorPatterns = [
        // Institution patterns
        /university/i, 
        /college/i, 
        /dept/i, 
        /department/i, 
        /staff/i,
        /tamu/i,
        /faculty/i,
        /texas a&m/i,
        
        // Course delivery methods
        /web based/i,
        /web-based/i,
        /distance education/i,
        /distance learning/i,
        /online/i,
        /remote/i,
        /virtual/i,
        
        // Course name patterns
        /introduction to/i,
        /honors/i,
        /principles of/i,
        /engineering/i,
        /calculus/i,
        /statistics/i,
        /fundamentals of/i,
        /laboratory/i,
        /course/i,
        /class/i,
        /section/i,
        /lecture/i,
        /seminar/i,
        /research/i
      ];
      
      // Check if name matches any pattern that suggests it's not a professor
      return !nonProfessorPatterns.some(pattern => pattern.test(p.name));
    });
    
    // Then, filter to only include professors teaching next term AND have at least one known section
    const teachingProfs = actualProfessors.filter(p => 
      p.teaching_next_term && 
      p.courses && 
      Array.isArray(p.courses) && 
      p.courses.length > 0
    );
    
    // If no professors are teaching next term with known sections, return an empty array
    if (teachingProfs.length === 0) {
      return [];
    }
    
    // Sort the filtered professors
    return [...teachingProfs].sort((a, b) => {
      if (sortMethod === 'honors') {
        // First sort by whether they have honors sections
        if (a.has_honors && !b.has_honors) return -1;
        if (!a.has_honors && b.has_honors) return 1;
        
        // Then sort by honors GPA if both have honors, otherwise by overall GPA
        if (a.has_honors && b.has_honors) {
          return b.honors_gpa - a.honors_gpa;
        } else {
          return b.average_gpa - a.average_gpa;
        }
      } else if (sortMethod === 'regular') {
        // First sort by whether they have regular sections
        if (a.has_regular && !b.has_regular) return -1;
        if (!a.has_regular && b.has_regular) return 1;
        
        // Then sort by regular GPA if both have regular, otherwise by overall GPA
        if (a.has_regular && b.has_regular) {
          return b.regular_gpa - a.regular_gpa;
        } else {
          return b.average_gpa - a.average_gpa;
        }
      } else {
        // Default: sort by overall GPA
        return (b.average_gpa || 0) - (a.average_gpa || 0);
      }
    });
  };

  // Function to log RMP data separately
  const logRmpData = (professors) => {
    console.group('%c RateMyProfessor Data Log', 'background: #1565c0; color: white; font-size: 14px; padding: 4px 8px;');
    
    // Count professors with RMP data
    const professorsWithRmp = professors.filter(p => p.rmp_found);
    console.log(`${professorsWithRmp.length} out of ${professors.length} professors have RMP data`);
    
    // For each professor, log their RMP data
    professors.forEach((prof, index) => {
      const hasRmp = prof.rmp_found;
      const rmpStatus = hasRmp ? 
        '%c ✅ HAS RMP DATA ' : 
        '%c ❌ NO RMP DATA ';
      const rmpStyle = hasRmp ? 
        'background: #4caf50; color: white; font-weight: bold; padding: 2px 6px; border-radius: 3px;' : 
        'background: #f44336; color: white; font-weight: bold; padding: 2px 6px; border-radius: 3px;';
      
      console.group(`${index + 1}. ${prof.name} (Last name: ${prof.last_name || 'Unknown'})`);
      console.log(rmpStatus, rmpStyle);
      
      if (hasRmp) {
        console.log('%c Rating: ' + prof.rmp_rating, 'font-weight: bold; color: #1565c0');
        console.log('%c Would Take Again: ' + prof.rmp_would_take_again, 'font-weight: bold; color: #2e7d32');
        console.log('%c Difficulty: ' + prof.rmp_difficulty, 'font-weight: bold; color: #c62828');
        
        if (prof.rmp_comments && Object.keys(prof.rmp_comments).length > 0) {
          console.log('%c Tags/Comments:', 'font-weight: bold');
          Object.keys(prof.rmp_comments).forEach(tag => {
            console.log(`  • ${tag}`);
          });
        } else {
          console.log('No tags/comments available');
        }
      } else {
        console.log('No RateMyProfessor data found for this professor');
      }
      
      console.groupEnd();
    });
    
    console.groupEnd();
  };

  const handleSearch = async () => {
    setLoading(true);
    setLoadingProgress(0);
    setError('');
    setSearched(true);
    
    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => Math.min(prev + 1, 90));
    }, 100);
    
    try {
      //console.log(`Searching for professors in ${department} ${courseCode}`);
      const url = `${API_URL}/api/professors/search?department=${department}&course_code=${courseCode}&include_galveston=${includeGalveston}`;
      //console.log(`API URL: ${url}`);
      
      // Update the display values when search is clicked
      setDisplayDepartment(department);
      setDisplayCourseCode(courseCode);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      //console.log('API Response:', data);
      
      // Debug RMP data
      console.group('RateMyProfessor Data Debug');
      console.log('Checking if RMP data is present in the API response:');
      if (data.professors && data.professors.length > 0) {
        const firstProf = data.professors[0];
        console.log('First professor object:', firstProf);
        console.log('Has RMP data?', 
          firstProf.hasOwnProperty('rmp_rating') && 
          firstProf.hasOwnProperty('rmp_would_take_again') && 
          firstProf.hasOwnProperty('rmp_difficulty') && 
          firstProf.hasOwnProperty('rmp_found')
        );
        console.log('RMP properties:', {
          rmp_rating: firstProf.rmp_rating,
          rmp_would_take_again: firstProf.rmp_would_take_again,
          rmp_difficulty: firstProf.rmp_difficulty,
          rmp_found: firstProf.rmp_found,
          rmp_comments: firstProf.rmp_comments
        });
      } else {
        console.log('No professors found in API response');
      }
      console.groupEnd();
      
      // Use the logger to display JSON extraction information
      logProfessorSearchData(data);
      
      // Log RMP data separately with more details
      if (data.professors && data.professors.length > 0) {
        logRmpData(data.professors);
      }
      
      // Log which professors are teaching next semester
      console.group('Professors teaching next semester:');
      const teachingProfessors = data.professors.filter(p => p.teaching_next_term);
      console.log(`Found ${teachingProfessors.length} professors teaching next semester`);
      
      if (teachingProfessors.length > 0) {
        console.table(teachingProfessors.map(p => ({
          'Name': p.name,
          'Teaching Next Term': p.teaching_next_term,
          'Average GPA': p.average_gpa,
          'Regular GPA': p.regular_gpa,
          'Honors GPA': p.honors_gpa,
          'Section': p.section_number || 'N/A',
          'CRN': p.crn || 'N/A',
          'No Historical Data': p.no_historical_data || false
        })));
      } else {
        console.log('No professors found teaching next semester');
        console.log('All professors from historical data:');
        console.table(data.professors.slice(0, 5).map(p => ({
          'Name': p.name,
          'Teaching Next Term': p.teaching_next_term,
          'Average GPA': p.average_gpa
        })));
      }
      console.groupEnd();
      
      // Also log the name matching debug data
      console.group('Name Matching Debug:');
      console.log('Comparing historical "LAST F" names with current "First Last" names');
      console.log('Using case-insensitive comparison of the LAST NAME only');
      
      data.professors.forEach(p => {
        // Historical name format is usually "LAST F" 
        const historicalLastName = p.name.split(' ')[0].toUpperCase();
        
        // Check if there's section data for this professor
        if (data.all_sections && data.all_sections.length > 0) {
          // Log instructors from all sections to help debug name matching
          data.all_sections.forEach(section => {
            try {
              const instructorJson = section.SWV_CLASS_SEARCH_INSTRCTR_JSON;
              if (instructorJson) {
                const instructors = typeof instructorJson === 'string' 
                  ? JSON.parse(instructorJson)
                  : (Array.isArray(instructorJson) ? instructorJson : [instructorJson]);
                  
                instructors.forEach(instructor => {
                  const fullName = instructor.NAME?.replace(' (P)', '') || '';
                  const currentLastName = fullName.split(' ').pop()?.toUpperCase();
                  
                  if (currentLastName && historicalLastName && currentLastName === historicalLastName) {
                    console.log(`MATCH: Historical "${p.name}" (last name: ${historicalLastName}) with current "${fullName}" (last name: ${currentLastName})`);
                  }
                });
              }
            } catch (err) {
              console.error('Error parsing instructor data:', err);
            }
          });
        }
      });
      console.groupEnd();
      
      // Get sections directly from the course sections endpoint
      try {
        console.log(`Fetching sections for ${department} ${courseCode} from dedicated endpoint`);
        const sectionsUrl = `${API_URL}/api/course/sections/${department}%20${courseCode}`;
        const sectionsResponse = await fetch(sectionsUrl);
        
        if (sectionsResponse.ok) {
          const sectionsData = await sectionsResponse.json();
          console.log('Sections data:', sectionsData);
          
          if (sectionsData.sections && sectionsData.sections.length > 0) {
            // Create a formatted list of sections instead of a table
            console.group(`All Sections for ${department} ${courseCode} in Fall 2025:`);
            console.log(`Total Sections: ${sectionsData.sections.length}`);
            
            // Process each section
            sectionsData.sections.forEach((section, index) => {
              const crn = section.SWV_CLASS_SEARCH_CRN || 'N/A';
              const sectionNum = section.SWV_CLASS_SEARCH_SECTION || 'N/A';
              const title = section.SWV_CLASS_SEARCH_TITLE || 'N/A';
              const available = section.STUSEAT_OPEN === 'Y' ? 'Yes' : 'No';
              const location = `${section.SWV_CLASS_SEARCH_BLDG_CODE || 'N/A'} ${section.SWV_CLASS_SEARCH_ROOM_CODE || 'N/A'}`;
              
              console.log(`\n%cSection ${index + 1}: ${sectionNum} (CRN: ${crn})`, 'font-weight: bold; color: #8b0000');
              console.log(`Title: ${title}`);
              console.log(`Available: ${available}`);
              console.log(`Location: ${location}`);
              
              // Process instructors with separate first/last names
              console.log('%cInstructors:', 'font-weight: bold');
              try {
                if (section.SWV_CLASS_SEARCH_INSTRCTR_JSON) {
                  const instructorText = section.SWV_CLASS_SEARCH_INSTRCTR_JSON;
                  const instructorArray = typeof instructorText === 'string' ? 
                    JSON.parse(instructorText) : 
                    (Array.isArray(instructorText) ? instructorText : [instructorText]);
                    
                  if (instructorArray.length === 0) {
                    console.log('  - None assigned');
                  } else {
                    instructorArray.forEach((instructor, i) => {
                      if (instructor.NAME) {
                        const fullName = instructor.NAME.replace(' (P)', '');
                        const nameParts = fullName.split(' ');
                        
                        // Extract first and last name
                        const lastName = nameParts.length > 0 ? nameParts[nameParts.length - 1] : '';
                        const firstName = nameParts.length > 1 ? nameParts.slice(0, nameParts.length - 1).join(' ') : '';
                        
                        console.log(`  - Instructor ${i + 1}: ${fullName}`);
                        console.log(`    • First Name: ${firstName}`);
                        console.log(`    • Last Name: ${lastName}`);
                        console.log(`    • Raw JSON: ${JSON.stringify(instructor)}`);
                      } else {
                        console.log(`  - Instructor ${i + 1}: No name provided`);
                      }
                    });
                  }
                } else {
                  console.log('  - No instructor data available');
                }
              } catch (err) {
                console.error('Error parsing instructor data:', err, section.SWV_CLASS_SEARCH_INSTRCTR_JSON);
                console.log(`  - Error parsing instructor data: ${err.message}`);
              }
            });
            
            console.groupEnd();
          } else {
            console.log(`No sections found for ${department} ${courseCode} in Fall 2025`);
          }
        } else {
          console.log(`Failed to fetch sections: ${sectionsResponse.status}`);
        }
      } catch (sectionError) {
        console.error('Error fetching course sections:', sectionError);
      }
      
      setProfessors(data.professors || []);
      setSearchStats({
        total_professors: data.total_professors || 0,
        fall_professors: data.professors?.filter(p => p.teaching_next_term).length || 0,
        has_fall_teachers: data.professors?.some(p => p.teaching_next_term) || false
      });

      // Add detailed logging of each professor's sections
      console.group('Professor Sections Detail:');
      if (data.professors && data.professors.length > 0) {
        data.professors.forEach(professor => {
          // Only log professors that are teaching next term
          if (professor.teaching_next_term) {
            console.group(`Professor: ${professor.name} (${professor.matched_with || 'No match'})`);
            console.log(`Last Name: ${professor.last_name}`);
            console.log(`Teaching Next Term: ${professor.teaching_next_term}`);
            console.log(`Average GPA: ${professor.average_gpa}`);
            
            if (professor.courses && Array.isArray(professor.courses) && professor.courses.length > 0) {
              console.log(`Number of Sections: ${professor.courses.length}`);
              console.log('Sections:');
              professor.courses.forEach((course, index) => {
                const availabilityStatus = course.is_available ? 'Open' : 'Closed';
                console.log(`  Section ${index + 1}: ${course.section} (CRN: ${course.crn}) - ${availabilityStatus}`);
              });
            } else {
              console.log('No sections found for this professor');
            }
            console.groupEnd();
          }
        });
      } else {
        console.log('No professors data available to show sections');
      }
      console.groupEnd();
    } catch (error) {
      console.error('Error searching professors:', error);
      setError(error.message || 'An error occurred while searching. Please try again.');
      setProfessors([]);
      setSearchStats({ 
        total_professors: 0, 
        fall_professors: 0,
        has_fall_teachers: false
      });
    } finally {
      clearInterval(progressTimer);
      // Quickly finish the progress bar
      setLoadingProgress(100);
      // Small delay to show the completed progress bar before removing it
      setTimeout(() => {
      setLoading(false);
      }, 300);
    }
  };

  const handleProfessorClick = async (professor) => {
    // Check if professor has any courses/sections
    if (!professor.courses || !Array.isArray(professor.courses) || professor.courses.length === 0) {
      //console.log("Professor has no known sections:", professor.name);
      setError(`${professor.name} has no known sections for ${displayDepartment} ${displayCourseCode}.`);
      setTimeout(() => setError(''), 3000); // Clear the error after 3 seconds
      return;
    }
    
    setSelectedProfessor(professor);
    
    try {
      // Fetch detailed section information for this professor
      const response = await fetch(`${API_URL}/api/course/sections/${department.toUpperCase()} ${courseCode}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.sections && data.sections.length > 0) {
          // Filter sections for this professor by matching section numbers
          let professorSections = [];
          
          if (professor.courses && professor.courses.length > 0) {
            // If we have specific course sections data from the professor
            const professorSectionNumbers = professor.courses.map(course => course.section);
            
            professorSections = data.sections.filter(section => 
              professorSectionNumbers.includes(section.SWV_CLASS_SEARCH_SECTION)
            );
            
            // Update the availability status for each course in professor.courses
            const updatedProfessor = {...professor};
            updatedProfessor.courses = professor.courses.map(course => {
              // Find matching section from API data
              const matchedSection = data.sections.find(
                section => section.SWV_CLASS_SEARCH_SECTION === course.section
              );
              
              // Add availability information to course
              return {
                ...course,
                is_available: matchedSection ? matchedSection.STUSEAT_OPEN === 'Y' : false
              };
            });
            
            // Update the selectedProfessor state with availability info
            setSelectedProfessor(updatedProfessor);
          }
          
          // Log detailed section information for the clicked professor
          console.group(`Detailed Sections for ${professor.name}:`);
          console.log(`Professor: ${professor.name}`);
          console.log(`Number of matched sections: ${professorSections.length}`);
          
          // Define professorSectionNumbers here before using it
          const professorSectionNumbers = professor.courses.map(course => course.section);
          console.log(`Section numbers from professor data: ${professorSectionNumbers.join(', ')}`);
          
          professorSections.forEach((section, index) => {
            console.group(`Section ${index + 1}: ${section.SWV_CLASS_SEARCH_SECTION} (CRN: ${section.SWV_CLASS_SEARCH_CRN})`);
            
            // Log the basic section details
            console.log(`Title: ${section.SWV_CLASS_SEARCH_TITLE || 'N/A'}`);
            console.log(`Max Enrollment: ${section.SEATS_MAX_ENROLLMENT || 'N/A'}`);
            console.log(`Current Enrollment: ${section.SEATS_ACTUAL_ENROLLMENT || 'N/A'}`);
            console.log(`Available: ${section.STUSEAT_OPEN === 'Y' ? 'Yes' : 'No'}`);
            
            // Try to extract and log instructor details
            try {
              if (section.SWV_CLASS_SEARCH_INSTRCTR_JSON) {
                const instructorText = section.SWV_CLASS_SEARCH_INSTRCTR_JSON;
                const instructors = typeof instructorText === 'string' ? 
                  JSON.parse(instructorText) : 
                  (Array.isArray(instructorText) ? instructorText : [instructorText]);
                
                console.log('Instructors:');
                instructors.forEach((instructor, i) => {
                  const name = instructor.NAME?.replace(' (P)', '') || 'Unknown';
                  console.log(`  - ${name}`);
                });
              } else {
                console.log('No instructor data available');
              }
            } catch (err) {
              console.log(`Error parsing instructor data: ${err.message}`);
            }
            
            // Log meeting times if available
            try {
              if (section.SWV_CLASS_SEARCH_JSON_CLOB) {
                let meetingInfo = section.SWV_CLASS_SEARCH_JSON_CLOB;
                if (typeof meetingInfo === 'string') {
                  meetingInfo = JSON.parse(meetingInfo);
                }
                
                if (Array.isArray(meetingInfo) && meetingInfo.length > 0) {
                  console.log('Meeting Times:');
                  meetingInfo.forEach((meeting, i) => {
                    // Build day string
                    const days = [];
                    if (meeting.SSRMEET_MON_DAY) days.push('M');
                    if (meeting.SSRMEET_TUE_DAY) days.push('T');
                    if (meeting.SSRMEET_WED_DAY) days.push('W');
                    if (meeting.SSRMEET_THU_DAY) days.push('R');
                    if (meeting.SSRMEET_FRI_DAY) days.push('F');
                    if (meeting.SSRMEET_SAT_DAY) days.push('S');
                    if (meeting.SSRMEET_SUN_DAY) days.push('U');
                    
                    const dayString = days.length > 0 ? days.join('') : 'N/A';
                    const startTime = meeting.SSRMEET_BEGIN_TIME || 'N/A';
                    const endTime = meeting.SSRMEET_END_TIME || 'N/A';
                    const location = `${meeting.SSRMEET_BLDG_CODE || 'N/A'} ${meeting.SSRMEET_ROOM_CODE || 'N/A'}`;
                    
                    console.log(`  - ${dayString} ${startTime}-${endTime} at ${location}`);
                  });
                } else {
                  console.log('No meeting time information available');
                }
              } else {
                console.log('No meeting time information available');
              }
            } catch (err) {
              console.log(`Error parsing meeting times: ${err.message}`);
            }
            
            // Log the full section object for reference
            console.log('Full section data:', section);
            console.groupEnd();
          });
          console.groupEnd();
          
          setSectionData(professorSections);
          setShowModal(true);
        } else {
          setSectionData([]);
          setShowModal(true);
        }
      } else {
        console.error(`Failed to fetch sections: ${response.status}`);
        setSectionData([]);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching section details:', error);
      setSectionData([]);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProfessor(null);
    setSectionData([]);
    setAlertStatus({}); // Reset alert statuses when closing modal
  };

  const extractMeetingTimes = (section) => {
    if (!section.SWV_CLASS_SEARCH_JSON_CLOB) return 'No meeting time information available';
    
    try {
      let meetingInfo = section.SWV_CLASS_SEARCH_JSON_CLOB;
      
      if (typeof meetingInfo === 'string') {
        meetingInfo = JSON.parse(meetingInfo);
      }
      
      if (!Array.isArray(meetingInfo) || meetingInfo.length === 0) {
        return 'No meeting time information available';
      }
      
      return meetingInfo.map((meeting, index) => {
        // Collect day abbreviations
        const days = [];
        if (meeting.SSRMEET_MON_DAY) days.push('M');
        if (meeting.SSRMEET_TUE_DAY) days.push('T');
        if (meeting.SSRMEET_WED_DAY) days.push('W');
        if (meeting.SSRMEET_THU_DAY) days.push('R');
        if (meeting.SSRMEET_FRI_DAY) days.push('F');
        if (meeting.SSRMEET_SAT_DAY) days.push('S');
        if (meeting.SSRMEET_SUN_DAY) days.push('U');
        
        const dayString = days.length > 0 ? days.join('') : 'N/A';
        const startTime = meeting.SSRMEET_BEGIN_TIME || 'N/A';
        const endTime = meeting.SSRMEET_END_TIME || 'N/A';
        const location = `${meeting.SSRMEET_BLDG_CODE || 'N/A'} ${meeting.SSRMEET_ROOM_CODE || 'N/A'}`;
        
        return (
          <div key={index} className="text-sm mb-1">
            <div className="flex items-center">
              <span className="font-medium mr-1">{dayString}</span> {startTime}-{endTime}
            </div>
            <div className="flex items-center mt-1 ml-1 text-gray-600">
              <MapPinIcon className="w-4 h-4 mr-1 text-gray-500" />
              <span>{location}</span>
            </div>
          </div>
        );
      });
    } catch (error) {
      console.error('Error parsing meeting times:', error);
      return 'Error parsing meeting time information';
    }
  };

  // Function to get meeting times for a course section
  const getCourseMeetingInfo = (sectionNumber, course = null) => {
    // First try to get data from sectionData (API fetched data)
    if (sectionData && sectionData.length > 0) {
      const matchingSection = sectionData.find(
        section => section.SWV_CLASS_SEARCH_SECTION === sectionNumber
      );
      
      if (matchingSection && matchingSection.SWV_CLASS_SEARCH_JSON_CLOB) {
        return extractMeetingTimes(matchingSection);
      }
    }
    
    // Then try to use the course data if provided (from professor.courses)
    if (course && course.meetings && course.meetings.length > 0) {
      console.log("Found meetings data in course object:", course.meetings);
      return (
        <>
          {course.meetings.map((meeting, idx) => (
            <div key={idx} className="text-sm mb-1">
              <div className="flex items-center">
                <span className="font-medium mr-1">{meeting.days}</span> {meeting.start_time}-{meeting.end_time}
              </div>
              <div className="flex items-center mt-1 ml-1 text-gray-600">
                <MapPinIcon className="w-4 h-4 mr-1 text-gray-500" />
                <span>{meeting.building} {meeting.room}</span>
              </div>
            </div>
          ))}
        </>
      );
    }
    
    // Debug option - log the course object to console for debugging
    if (course) {
      console.log(`Course object for section ${sectionNumber}:`, course);
    }
    
    // Default fallback message
    return (
      <div className="text-sm italic text-gray-500">
        Meeting time information will be available soon
      </div>
    );
  };

  // Apply current sort method to professors
  const sortedProfessors = sortProfessors(professors, sortBy);
  
  // Count professors with honors sections among those teaching next term
  const honorsProfsCount = sortedProfessors.filter(p => p.has_honors).length;
  
  // Count professors teaching in Fall 2025
  const fallTeachersCount = sortedProfessors.length;
  
  // For UI purposes - check if we need to separate professors with and without the sorted section type
  const needsSeparator = sortBy !== 'overall' && sortedProfessors.length > 0;
  
  // Find the index where the separation should happen (professors with the section type vs without)
  const separatorIndex = needsSeparator 
    ? sortedProfessors.findIndex(p => (
      sortBy === 'honors' ? !p.has_honors : 
      !p.has_regular
    )) 
    : -1;

  // Are we filtering results
  const isFiltering = searchStats.fall_professors < searchStats.total_professors;

  // Function to handle adding an alert
  const handleAddAlert = async (crn, section) => {
    if (!crn) {
      console.error('No CRN provided');
      setAlertStatus({
        ...alertStatus,
        [crn]: { success: false, message: 'Invalid CRN' }
      });
      return;
    }

    // Set loading state for this specific CRN
    setAlertStatus({
      ...alertStatus,
      [crn]: { loading: true }
    });

    try {
      // Check if user provided email
      const userEmail = email || localStorage.getItem('userEmail') || 'colinxu2006@gmail.com';
      
      // Get the user profile to see if they have phone verification
      const profileResponse = await fetch(`${API_URL}/api/users/profile?email=${encodeURIComponent(userEmail)}`);
      let userProfile = {};
      
      if (profileResponse.ok) {
        userProfile = await profileResponse.json();
        //console.log('User profile for alert:', userProfile);
      }
      
      // Prepare the alert data in the required format
      const alertData = {
        crn,
        term: '202531', // Fall 2025
        email: userEmail,
        original_email: userEmail,
        use_phone: true,
        phone_number: userProfile.phone_number || '3605253013',
        phone_verified: userProfile.phone_verified || true,
        phone_carrier: userProfile.phone_carrier || 'tmobile',
        timestamp: Date.now() / 1000,
        active: true,
        status: true,
        notified: true,
        notified_at: Date.now() / 1000,
        notified_via_sms: true,
        last_checked: Date.now() / 1000
      };
      
      const response = await fetch(`${API_URL}/api/add-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alertData)
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store email for future use
        if (userEmail) {
          localStorage.setItem('userEmail', userEmail);
        }
        
        setAlertStatus({
          ...alertStatus,
          [crn]: { 
            success: true, 
            message: data.message || 'Alert added successfully!' 
          }
        });
        console.log(`Added alert for CRN ${crn} (Section ${section})`);
      } else {
        setAlertStatus({
          ...alertStatus,
          [crn]: { 
            success: false, 
            message: data.error || 'Failed to add alert' 
          }
        });
        console.error('Error adding alert:', data.error);
      }
    } catch (error) {
      console.error('Error adding alert:', error);
      setAlertStatus({
        ...alertStatus,
        [crn]: { 
          success: false, 
          message: 'An error occurred. Please try again.' 
        }
      });
    }
  };

  useEffect(() => {
    if (professors) {
      // Log professors for debugging
      console.group('Professor Debug Info');
      console.log(`Found ${professors.length} total professors`);
      
      const teachingProfs = professors.filter(prof => prof.teaching_next_term);
      console.log(`${teachingProfs.length} professors teaching next semester`);
      
      // Log detailed course information including meetings data structure
      console.group('Professor Courses Debug Info');
      teachingProfs.forEach(prof => {
        if (prof.courses && prof.courses.length > 0) {
          console.group(`Professor ${prof.name} courses:`);
          console.log(`Number of courses: ${prof.courses.length}`);
          
          prof.courses.forEach((course, index) => {
            console.group(`Course ${index + 1}:`);
            console.log('Course object:', course);
            if (course.meetings) {
              console.log('Has meetings data:', course.meetings.length > 0);
              console.log('Meetings data:', course.meetings);
            } else {
              console.log('No meetings data available');
            }
            console.groupEnd();
          });
          
          console.groupEnd();
        }
      });
      
      if (teachingProfs.length > 0) {
        console.group('Professors teaching next semester:');
        teachingProfs.forEach(prof => {
          console.log(`${prof.name} - GPA: ${prof.average_gpa || 'N/A'} - Section: ${prof.section_number || 'N/A'} - CRN: ${prof.crn || 'N/A'}`);
        });
        console.groupEnd();
      } else {
        console.log('No professors found teaching next semester');
        
        // Log historical professors if none teaching
        const historicalProfs = professors.filter(prof => !prof.no_historical_data);
        if (historicalProfs.length > 0) {
          console.group('Historical professors (not teaching next semester):');
          historicalProfs.forEach(prof => {
            console.log(`${prof.name} - GPA: ${prof.average_gpa || 'N/A'}`);
          });
          console.groupEnd();
        }
      }
      
      // Log professors with no historical data
      const noHistoricalProfs = professors.filter(prof => prof.no_historical_data);
      if (noHistoricalProfs.length > 0) {
        console.group('Professors with no historical data:');
        noHistoricalProfs.forEach(prof => {
          console.log(`${prof.name} - Teaching next semester: ${prof.teaching_next_term ? 'Yes' : 'No'}`);
        });
        console.groupEnd();
      }
      
      console.groupEnd();
    }
  }, [professors]);

  // Check if RMP module is available on the backend
  useEffect(() => {
    const checkRmpAvailability = async () => {
      try {
        const response = await fetch(`${API_URL}/api/status`);
        if (response.ok) {
          const data = await response.json();
          setRmpModuleAvailable(data.rmp_available || false);
          //console.log('RMP module availability:', data.rmp_available ? 'Available' : 'Not available');
        } else {
          setRmpModuleAvailable(false);
          //console.log('Could not determine RMP module availability');
        }
      } catch (error) {
        console.error('Error checking RMP module availability:', error);
        setRmpModuleAvailable(false);
      }
    };
    
    checkRmpAvailability();
  }, []);

  // Add useEffect to load email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find the Best Classes</h1>
          <p className="text-gray-600">Search by department and course code to find professors with the highest GPAs</p>
          
          {/* RMP Module Status Indicator */}
          {rmpModuleAvailable !== null && (
            <div className="mt-3 flex items-center justify-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                rmpModuleAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                <span className={`w-2 h-2 mr-1 rounded-full ${
                  rmpModuleAvailable 
                    ? 'bg-green-500' 
                    : 'bg-yellow-500'
                }`}></span>
                RateMyProfessor Data: {rmpModuleAvailable ? 'Available' : 'Not Available'}
              </span>
              {!rmpModuleAvailable && (
                <span className="ml-2 text-xs text-gray-500">
                  (Some required packages may be missing)
                </span>
              )}
            </div>
          )}
          
          {/* RMP Module Installation Instructions */}
          {/* {!rmpModuleAvailable && (
            <div className="mt-4 mx-auto max-w-lg p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200">
              <p className="font-medium">To enable RateMyProfessor data, install the required packages:</p>
              <div className="mt-2 bg-gray-800 text-white p-3 rounded font-mono text-xs overflow-x-auto">
                <p>cd /path/to/AggieClassAlert-Website</p>
                <p>python -m venv venv</p>
                <p>source venv/bin/activate</p>
                <p>pip install requests beautifulsoup4</p>
              </div>
              <p className="mt-2 text-xs">Then restart the backend server.</p>
            </div>
          )} */}
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  placeholder="e.g., MATH"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g., 151"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                />
              </div>
            </div>
            {/* Add toggle switch before the search button */}
            {/* <div className="flex items-center justify-between mt-4 mb-2">
              <label className="flex items-center cursor-pointer">
                <div className="mr-3 text-sm font-medium text-gray-700">Include Galveston professors</div>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={includeGalveston}
                    onChange={(e) => setIncludeGalveston(e.target.checked)}
                  />
                  <div className={`block w-14 h-8 rounded-full ${includeGalveston ? 'bg-maroon' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${includeGalveston ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div> */}
            <button 
              className="w-full mt-2 px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon/90 transition-colors flex items-center justify-center gap-2"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="animate-pulse">Searching for professors...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  Search Professors and their Sections
                </>
              )}
            </button>
            
            {/* RMP Debug Toggle Button */}
            {/* <button 
              className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              onClick={() => setShowRmpDebug(!showRmpDebug)}
            >
              {showRmpDebug ? "Hide RMP Debug Data" : "Show RMP Debug Data"}
            </button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )} */}
            
            {/* RMP Debug Panel */}
            {showRmpDebug && professors.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg overflow-auto max-h-96">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">RateMyProfessor Debug Data</h3>
                <table className="w-full text-sm text-left">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="p-2">Professor</th>
                      <th className="p-2">RMP Found</th>
                      <th className="p-2">Rating</th>
                      <th className="p-2">Would Take Again</th>
                      <th className="p-2">Difficulty</th>
                      <th className="p-2">Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professors.map((prof, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                        <td className="p-2 font-medium">{prof.name}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            prof.rmp_found ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {prof.rmp_found ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="p-2">{prof.rmp_rating || 'N/A'}</td>
                        <td className="p-2">{prof.rmp_would_take_again || 'N/A'}</td>
                        <td className="p-2">{prof.rmp_difficulty || 'N/A'}</td>
                        <td className="p-2">
                          <div className="flex flex-wrap gap-1">
                            {prof.rmp_comments && Object.keys(prof.rmp_comments).length > 0 ? 
                              Object.keys(prof.rmp_comments).slice(0, 3).map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))
                              : 'None'
                            }
                            {prof.rmp_comments && Object.keys(prof.rmp_comments).length > 3 && (
                              <span className="text-blue-500 text-xs">
                                +{Object.keys(prof.rmp_comments).length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Loading Bar - Shown independently of search results */}
        {loading && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div className="bg-maroon h-2.5 rounded-full animate-pulse" style={{ width: `${loadingProgress}%` }}></div>
            </div>
            <p className="text-center text-sm text-gray-500 animate-pulse">
              {loadingProgress < 30 && "Searching for professors..."}
              {loadingProgress >= 30 && loadingProgress < 60 && "Analyzing GPA data..."}
              {loadingProgress >= 60 && loadingProgress < 90 && "Finding RateMyProfessor ratings..."}
              {loadingProgress >= 90 && "Almost there..."}
            </p>
          </div>
        )}

        {/* Results Section */}
        {searched && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {loading ? (
                    `Searching for professors teaching ${displayDepartment} ${displayCourseCode}...`
                  ) : (
                    sortedProfessors.length > 0 
                      ? `Found ${sortedProfessors.length} professors teaching ${displayDepartment} ${displayCourseCode} next semester` 
                      : `No professors with known sections found teaching ${displayDepartment} ${displayCourseCode} next semester`
                  )}
                </h2>
                
                {searched && professors.length > sortedProfessors.length && !loading && (
                  <div className="mt-1 text-sm text-gray-600">
                    Showing only professors teaching next semester with known section information. {professors.length} professors have taught this course historically.
                  </div>
                )}
                
                {honorsProfsCount > 0 && !loading && (
                  <div className="mt-1 text-sm text-maroon font-medium">
                    {honorsProfsCount} professor{honorsProfsCount !== 1 ? 's' : ''} teach honors sections 
                    <span className="inline-flex ml-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-maroon/10 text-maroon">
                      HONORS
                    </span>
                  </div>
                )}
              </div>
              
              {/* Sort Options */}
              {sortedProfessors.length > 0 && !loading && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-700">Sort teaching professors by:</span>
                  <select 
                    className="text-sm border-gray-300 rounded-md"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="overall">Overall GPA</option>
                    <option value="regular">Regular Section GPA</option>
                    <option value="honors">Honors Section GPA</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* If sorting by a specific criteria, show separator */}
              {needsSeparator && separatorIndex !== -1 && separatorIndex !== 0 && (
                <div className="bg-indigo-50 p-3 rounded-lg text-center text-indigo-700 font-medium border border-indigo-200">
                  {`Showing ${separatorIndex} professors ${
                    sortBy === 'honors' 
                      ? 'with honors sections' 
                      : 'with regular sections'
                  }`}
                </div>
              )}
            
              {sortedProfessors.map((professor, index) => {
                // Add a divider between professors with and without the sorted section type
                const showDivider = needsSeparator && separatorIndex !== -1 && index === separatorIndex;
                
                // Determine if this professor should have a highlighted background for honors
                const hasHonors = professor.has_honors;
                
                return (
                  <React.Fragment key={index}>
                    {showDivider && (
                      <div className="bg-gray-100 p-3 rounded-lg text-center text-gray-700 font-medium border border-gray-200">
                        {`Professors ${
                          sortBy === 'honors' 
                            ? 'without honors sections' 
                            : 'without regular sections'
                        } (sorted by overall GPA)`}
                      </div>
                    )}
                    
                    <div className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow relative ${
                      hasHonors ? 'border-2 border-maroon/20' : ''
                    }`}>
                      {/* Teaching in upcoming semester badge */}
                      {professor.teaching_next_term && (
                        <div className="absolute top-0 left-0 transform -translate-y-1/2 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg shadow-md">
                          TEACHING NEXT SEMESTER
                        </div>
                      )}
                      
                      {/* Course and section info for clarity */}
                      {professor.teaching_next_term && (
                        <div className="absolute top-6 left-0 transform text-xs text-green-800 font-semibold">
                          {professor.section_number && `Section ${professor.section_number}`} 
                        </div>
                      )}
                      
                      {/* Honors ribbon for professors with honors sections */}
                      {hasHonors && (
                        <div className="absolute -top-2 -right-2 py-1 px-3 bg-maroon text-white text-xs font-bold rounded-lg transform rotate-12 shadow-md">
                          HONORS PROFESSOR
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between relative mt-2">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <AcademicCapIcon className="w-6 h-6 text-maroon" />
                            <button 
                              onClick={() => handleProfessorClick(professor)} 
                              className="hover:text-maroon hover:underline cursor-pointer"
                            >
                            {professor.name}
                            </button>
                            {professor.has_honors && (
                              <span className="ml-2 px-2 py-0.5 bg-maroon/10 text-maroon text-xs font-bold rounded-full flex items-center gap-1">
                                <span className="inline-block w-2 h-2 bg-maroon rounded-full"></span>
                                HONORS
                              </span>
                            )}
                          </h2>
                          {professor.fall_name && professor.fall_name !== professor.name && (
                            <div className="text-sm text-gray-500 ml-9">
                              Listed as: {professor.fall_name}
                            </div>
                          )}
                          <div className="mt-2 flex items-center">
                            <span className="text-lg font-semibold text-maroon mr-2">
                              Overall GPA: {professor.average_gpa !== null ? professor.average_gpa.toFixed(2) : 'N/A'}
                            </span>
                            <div className="flex">
                              {professor.average_gpa !== null ? renderStars(professor.average_gpa) : null}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">(out of 4.0)</span>
                            {professor.rmp_found && (
                              <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center gap-1">
                                <span className="inline-block w-2 h-2 bg-blue-800 rounded-full"></span>
                                RMP: {professor.rmp_rating}
                              </span>
                            )}
                          </div>

                          {/* RateMyProfessor information */}
                          {professor.rmp_found && (
                            <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                              <div className="text-sm font-medium text-blue-800 mb-1 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                RateMyProfessor Data
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <div className="text-xs text-gray-600">Overall</div>
                                  <div className="text-base font-semibold">{professor.rmp_rating || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600">Would Take Again</div>
                                  <div className="text-base font-semibold">{professor.rmp_would_take_again || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600">Difficulty</div>
                                  <div className="text-base font-semibold">{professor.rmp_difficulty || 'N/A'}</div>
                                </div>
                              </div>
                              {professor.rmp_comments && Object.keys(professor.rmp_comments).length > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs text-gray-600 mb-1">Common Tags</div>
                                  <div className="flex flex-wrap gap-1">
                                    {Object.keys(professor.rmp_comments).slice(0, 5).map((comment, idx) => (
                                      <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        {comment}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-maroon/10 text-maroon rounded-full text-sm font-medium">
                            {professor.department}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {professor.has_regular && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                              <span>Regular Sections ({professor.regular_count})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-medium text-gray-900">{professor.regular_gpa !== null ? professor.regular_gpa.toFixed(2) : 'N/A'}</span>
                              <div className="flex">
                                {professor.regular_gpa !== null ? renderStars(professor.regular_gpa) : null}
                              </div>
                              <span className="text-xs text-gray-500 ml-1">(out of 4.0)</span>
                            </div>
                            <div className="mt-2">
                              <div className="h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 bg-blue-500 rounded-full"
                                  style={{ width: `${(professor.regular_gpa !== null ? professor.regular_gpa / 4 * 100 : 0)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {professor.has_honors && (
                          <div className="bg-maroon/5 p-3 rounded-lg border-2 border-maroon/20">
                            <div className="text-sm font-medium text-maroon mb-1 flex items-center justify-between">
                              <span>Honors Sections ({professor.honors_count})</span>
                              <span className="px-2 py-0.5 bg-maroon/10 text-maroon text-xs font-bold rounded-full flex items-center gap-1">
                                <span className="inline-block w-2 h-2 bg-maroon rounded-full"></span>
                                HONORS
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-medium text-maroon">{professor.honors_gpa !== null ? professor.honors_gpa.toFixed(2) : 'N/A'}</span>
                              <div className="flex">
                                {professor.honors_gpa !== null ? renderStars(professor.honors_gpa) : null}
                              </div>
                              <span className="text-xs text-gray-500 ml-1">(out of 4.0)</span>
                            </div>
                            <div className="mt-2">
                              <div className="h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 bg-maroon rounded-full"
                                  style={{ width: `${(professor.honors_gpa !== null ? professor.honors_gpa / 4 * 100 : 0)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
                            </div>
                          </div>
                        )}
                      </div>

      {/* Modal for professor section details */}
      {showModal && selectedProfessor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <AcademicCapIcon className="w-6 h-6 text-maroon" />
                    {selectedProfessor.name}
                  </h2>
                  <p className="text-gray-600 flex items-center">
                    {displayDepartment} {displayCourseCode} Sections
                    {selectedProfessor.rmp_found && (
                      <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-blue-800 rounded-full"></span>
                        RMP: {selectedProfessor.rmp_rating}
                      </span>
                    )}
                  </p>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              {/* Email input for alerts */}
              <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <label htmlFor="alert-email" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Your Email for Alerts:
                  </label>
                  <input
                    id="alert-email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon text-sm"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  We'll notify you when a section becomes available. Email is optional if you're just browsing.
                </p>
              </div>
              
              {/* RateMyProfessor details */}
              {selectedProfessor.rmp_found && (
                <div className="mb-4 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    RateMyProfessor Ratings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-600">Overall Rating</div>
                      <div className="text-2xl font-bold text-blue-800">{selectedProfessor.rmp_rating}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-600">Would Take Again</div>
                      <div className="text-2xl font-bold text-blue-800">{selectedProfessor.rmp_would_take_again}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-600">Difficulty</div>
                      <div className="text-2xl font-bold text-blue-800">{selectedProfessor.rmp_difficulty}</div>
                    </div>
                  </div>
                  
                  {/* Common tags/comments */}
                  {selectedProfessor.rmp_comments && Object.keys(selectedProfessor.rmp_comments).length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Common Tags from Student Reviews</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(selectedProfessor.rmp_comments).map((comment, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {comment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {sectionData.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Course Sections and Schedule</h3>
                  {sectionData.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">
                          Section {section.SWV_CLASS_SEARCH_SECTION}
                          <span className="ml-2 text-gray-500 text-sm">
                            (CRN: {section.SWV_CLASS_SEARCH_CRN})
                          </span>
                        </h4>
                        <span className={`text-sm px-2 py-0.5 rounded-full ${
                          section.STUSEAT_OPEN === 'Y' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {section.STUSEAT_OPEN === 'Y' ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex items-start gap-2 text-gray-700">
                          <ClockIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            {getCourseMeetingInfo(section.SWV_CLASS_SEARCH_SECTION, section)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Add to Alerts button */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex-1">
                          {alertStatus[section.SWV_CLASS_SEARCH_CRN] && (
                            <div className={`text-sm ${
                              alertStatus[section.SWV_CLASS_SEARCH_CRN].success 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {alertStatus[section.SWV_CLASS_SEARCH_CRN].message}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddAlert(section.SWV_CLASS_SEARCH_CRN, section.SWV_CLASS_SEARCH_SECTION)}
                          disabled={alertStatus[section.SWV_CLASS_SEARCH_CRN]?.loading || alertStatus[section.SWV_CLASS_SEARCH_CRN]?.success}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                            alertStatus[section.SWV_CLASS_SEARCH_CRN]?.success
                              ? 'bg-green-100 text-green-800 cursor-default'
                              : section.STUSEAT_OPEN === 'Y'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-maroon text-white hover:bg-maroon/90'
                          }`}
                        >
                          {alertStatus[section.SWV_CLASS_SEARCH_CRN]?.loading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Adding...
                            </span>
                          ) : alertStatus[section.SWV_CLASS_SEARCH_CRN]?.success ? (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                              </svg>
                              Added
                            </span>
                          ) : (
                            "Add Alert"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedProfessor.courses && selectedProfessor.courses.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Known Sections:</h3>
                  <div className="space-y-3">
                    {selectedProfessor.courses.map((course, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-gray-900">
                              Section {course.section}
                              <span className="ml-2 text-gray-500">
                                (CRN: {course.crn})
                              </span>
                            </span>
                            
                            {/* Availability status */}
                            <span className={`inline-block mt-1 text-sm px-2 py-0.5 rounded-full ${
                              course.is_available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {course.is_available ? 'Open' : 'Closed'}
                            </span>
                            
                            {/* Meeting times and location */}
                            <div className="space-y-1 mt-1">
                              <div className="flex items-start gap-2 text-gray-700">
                                <ClockIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  {getCourseMeetingInfo(course.section, course)}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Add alert button */}
                          <div className="flex items-center gap-2">
                            {alertStatus[course.crn] && (
                              <div className={`text-sm ${
                                alertStatus[course.crn].success 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              }`}>
                                {alertStatus[course.crn].message}
                              </div>
                            )}
                            
                            <button
                              onClick={() => handleAddAlert(course.crn, course.section)}
                              disabled={alertStatus[course.crn]?.loading || alertStatus[course.crn]?.success}
                              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                                alertStatus[course.crn]?.success
                                  ? 'bg-green-100 text-green-800 cursor-default'
                                  : course.is_available
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-maroon text-white hover:bg-maroon/90'
                              }`}
                            >
                              {alertStatus[course.crn]?.loading ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Adding...
                                </span>
                              ) : alertStatus[course.crn]?.success ? (
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                  </svg>
                                  Added
                                </span>
                              ) : (
                                "Add Alert"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
                    </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Search; 