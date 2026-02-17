/**
 * @file Handles all endpoints for the playlists data.
 * @author Andrew Boisvert <abois526@mtroyal.ca>
 */

/*--------------------------------------
/ SECTION: Module Imports
/-------------------------------------*/
const { jsonErrorMsg, logFormattedSupabaseError } = require("./utils.js");

/*--------------------------------------
/ SECTION: Functions
/-------------------------------------*/
/**
 * @description returns JSON for all songs for the specified playlist
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleAll(supabase, app) {
  app.get('/api/playlists/:ref', async (req, res) => {
  const { data, error } = await supabase
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
    .eq('playlist_id', req.params.ref);
    // handle supabase error
    if (error) {
      logFormattedSupabaseError(error);
      return res.status(500).json(jsonErrorMsg(
        "Error (Supabase)",
        error.message
      ));
    }
    // if query produces a result return data, else provide error message
    if (data.length > 0) { 
      res.status(200).json(data);
    } else {
      res.status(404).json(jsonErrorMsg(
        "Error (Not Found)",
        `No playlist match found for the playlist_id ${req.params.ref}`
      ));
    }
  });
}

/*--------------------------------------
/ SECTION: Module Exports
/-------------------------------------*/
module.exports = { 
  handleAll
};