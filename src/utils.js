/**
 * @file Reusable helper functions.
 * @author Andrew Boisvert <abois526@mtroyal.ca>
 */

/*--------------------------------------
/ SECTION: Functions 
/-------------------------------------*/
/**
 * @description helper function to create a JSON message
 * @param {String} msg the JSON message
 * @returns {Object} a message in JSON format
 */
const jsonErrorMsg = (msg) => {
  return { Error: msg };
};

/*--------------------------------------
/ SECTION: Module Exports
/-------------------------------------*/
module.exports = { 
  jsonErrorMsg 
};