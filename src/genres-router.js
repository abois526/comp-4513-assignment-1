/**
 * @file Handles all endpoints for the genres data.
 * @author Andrew Boisvert <abois526@mtroyal.ca>
 */

/*--------------------------------------
/ SECTION: Module Imports
/-------------------------------------*/
const { jsonErrorMsg, logFormattedSupabaseError, validateQueryResultAndRespond } = require("./utils.js");

/*--------------------------------------
/ SECTION: Functions
/-------------------------------------*/
/**
 * @description returns JSON for all genres 
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleAll(supabase, app) {
  app.get('/api/genres', async (req, res) => {
    const {data, error, status, statusText} = await supabase 
      .from('genres')
      .select();
    // handle supabase errors
    if (error) {
      logFormattedSupabaseError(error, status, statusText);
      return res.status(status).json(jsonErrorMsg(
        "Error", `Supabase error - ${error.message}`
      ));
    }
    // return the data
    res.json(data);
  });
}

/*--------------------------------------
/ SECTION: Module Exports
/-------------------------------------*/
module.exports = { 
  handleAll
};