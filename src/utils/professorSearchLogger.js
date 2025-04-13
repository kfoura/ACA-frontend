/**
 * Professor Search Logger
 * 
 * This utility file provides functions to log the JSON extraction information
 * from the professor search API responses.
 */

/**
 * Logs the JSON extraction information from the professor search API response
 * @param {Object} data - The API response data
 */
export const logProfessorSearchData = (data) => {
  console.group('Professor Search Data');

  // Log basic info
  console.log(`Department: ${data.department}, Course Code: ${data.course_code}`);
  console.log(`Found ${data.professors?.length || 0} total professors`);
  console.log(`Upcoming Term: ${data.upcoming_term || 'Unknown'}`);
  
  // Log professor extraction data if available
  if (data.console_log && data.console_log.length > 0) {
    console.group('Server Extraction Logs');
    data.console_log.forEach(line => console.log(line));
    console.groupEnd();
  }
  
  // Log debug data if available
  if (data.debug) {
    console.group('Debug Data');
    console.log(data.debug);
    console.groupEnd();
  }
  
  // Log RateMyProfessor data for each professor
  if (data.professors && data.professors.length > 0) {
    console.group('RateMyProfessor Data');
    console.log(`Checking RMP data for ${data.professors.length} professors:`);
    
    const professorsWithRMP = data.professors.filter(p => p.rmp_found);
    console.log(`Found RMP data for ${professorsWithRMP.length} out of ${data.professors.length} professors`);
    
    // Create a table for all professors and their RMP data
    const rmpTable = data.professors.map(p => ({
      'Name': p.name,
      'Last Name': p.last_name || 'N/A',
      'RMP Found': p.rmp_found || false,
      'Rating': p.rmp_rating || 'N/A',
      'Would Take Again': p.rmp_would_take_again || 'N/A',
      'Difficulty': p.rmp_difficulty || 'N/A',
      'Comment Tags': p.rmp_comments ? Object.keys(p.rmp_comments).join(', ') : 'None'
    }));
    
    console.table(rmpTable);
    
    // Log detailed RMP data for each professor that has it
    if (professorsWithRMP.length > 0) {
      console.group('Detailed RMP Data');
      professorsWithRMP.forEach(p => {
        console.group(`Professor: ${p.name}`);
        console.log(`Overall Rating: ${p.rmp_rating}`);
        console.log(`Would Take Again: ${p.rmp_would_take_again}`);
        console.log(`Difficulty: ${p.rmp_difficulty}`);
        console.log('Comment Tags:', p.rmp_comments ? Object.keys(p.rmp_comments) : 'None');
        console.groupEnd();
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }
  
  console.groupEnd();
};

export default logProfessorSearchData; 