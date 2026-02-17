/**
 * @file Reusable helper functions.
 * @author Andrew Boisvert <abois526@mtroyal.ca>
 */

/*--------------------------------------
/ SECTION: Functions 
/-------------------------------------*/
/**
 * @description helper function to create a JSON message
 * @param {String} key the key for the JSON message
 * @param {String} value the value for the JSON message
 * @returns {Object} a message in JSON format
 */
const jsonErrorMsg = (key, value) => {
  return { [key]: value};
};

/**
 * @description formats error details for supabase errors
 * @param {String} error the supabase error
 */
function logFormattedSupabaseError(error) {
  console.log(`Error code: ${error.error}`);
  console.log(`Error message: ${error.message}`);
  console.log(`HTTP status: ${error.status}`);
  console.log(`Status code: ${error.statusCode}`);
}

/*--------------------------------------
/ SECTION: Module Exports
/-------------------------------------*/
module.exports = { 
  jsonErrorMsg,
  logFormattedSupabaseError
};