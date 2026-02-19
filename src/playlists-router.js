/**
 * @file Handles all endpoints for the playlists data.
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
 * @description returns JSON for all songs for the specified playlist
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleByPlaylist(supabase, app) {
  app.get('/api/playlists/:ref', async (req, res) => {
    const parameter = req.params.ref;
    const { data, error, status, statusText } = await supabase
      .from('playlists')
      .select(
        `
        playlist_id,
        ...songs!inner(
          song_id,
          title,
          year,
          ...artists!inner(
            artist_name
          ),
          ...genres!inner(
            genre_name
          )
        )
        `,
      )
      .eq('playlist_id', parameter);
    // handle supabase errors
    if (error) {
      logFormattedSupabaseError(error, status, statusText);
      return res.status(status).json(jsonErrorMsg(
        "Error", `Supabase error - ${error.message}`
      ));
    }
    // if query produces a result return data, else provide error message
    validateQueryResultAndRespond(res, data, parameter);
  });
}

/*--------------------------------------
/ SECTION: Module Exports
/-------------------------------------*/
module.exports = { 
  handleByPlaylist
};