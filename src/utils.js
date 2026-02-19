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
function logFormattedSupabaseError(error, status, statusText) {
  console.error("Logging error\n---");
  console.error(`Error message: ${error.message}`);
  console.error(`Error details: ${error.details}`);
  console.error(`Error hint: ${error.hint}`);
  console.error(`Error code: ${error.code}`);
  console.error(`HTTP status: ${status}`);
  console.error(`HTTP status text: ${statusText}\n`);
}

/**
 * @description validates that the query response produced data and sends a response if so, otherwise responds with an error message
 * @param {Object} res response object for the server
 * @param {Object} data the data from the query
 * @param {String|Number} parameter the specified parameter to filter the query results
 */
function validateQueryResultAndRespond(res, data, parameter) {
  if (data.length > 0) { 
    res.json(data);
  } else {
    res.status(404).json(jsonErrorMsg(
      `Error:`,
      `The request filtered by the parameter '${parameter}' did not return any data`
    ));
  }
}

/*--------------------------------------
/ SECTION: Module Exports
/-------------------------------------*/
module.exports = { 
  jsonErrorMsg,
  logFormattedSupabaseError,
  validateQueryResultAndRespond
};