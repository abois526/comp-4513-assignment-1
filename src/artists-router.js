/**
 * @file Handles all endpoints for the artists data.
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
 * @description returns JSON for all artists sorted by artist_name
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleAll(supabase, app) {
  app.get('/api/artists', async (req, res) => {
    const {data, error} = await supabase 
      .from('artists')
      .select(`
        artist_id,
        artist_name,
        types(type_name),
        artist_image_url,
        spotify_url,
        spotify_desc
      `)
      .order('artist_name', {ascending: true});
    if (error) {
      console.error(`Supabase error: ${error}`);
      return res.status(500).json(jsonErrorMsg(error.message));
    }
    res.status(200).send(data);
  });
}

/*--------------------------------------
/ SECTION: Module Exports
/-------------------------------------*/
module.exports = { 
  handleAll 
};