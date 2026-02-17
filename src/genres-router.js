/**
 * @file Handles all endpoints for the genres data.
 * @author Andrew Boisvert <abois526@mtroyal.ca>
 */

/*--------------------------------------
/ SECTION: Module Imports
/-------------------------------------*/
const { jsonErrorMsg } = require("./utils.js");

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
    const {data, error} = await supabase 
      .from('genres')
      .select();
    // handle supabase error
    if (error) {
      console.error(`Supabase error: ${error}`);
      return res.status(500).json(jsonErrorMsg(error.message));
    }
    // return the data
    res.status(200).json(data);
  });
}

/*--------------------------------------
/ SECTION: Module Exports
/-------------------------------------*/
module.exports = { 
  handleAll
};