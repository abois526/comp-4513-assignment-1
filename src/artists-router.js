/**
 * @file Handles all endpoints for the artists data.
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
 * @description returns JSON for all artists sorted by artist_name
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleAll(supabase, app) {
  app.get('/api/artists', async (req, res) => {
    const {data, error, status, statusText} = await supabase 
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
    // handle supabase errors
    if (error) {
      logFormattedSupabaseError(error, status, statusText);
      return res.status(status).json(jsonErrorMsg("Error (Supabase)", error.message));
    }
    // return the data
    res.json(data);
  });
}

/**
 * @description returns the specified artist (by the artist_id field)
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleByArtist(supabase, app) {
  app.get('/api/artists/:ref', async (req, res) => {
    const parameter = req.params.ref;
    const {data, error, status, statusText} = await supabase 
      .from('artists')
      .select(`
        artist_id,
        artist_name,
        types(type_name),
        artist_image_url,
        spotify_url,
        spotify_desc
      `)
      .eq('artist_id', parameter);
    // handle supabase errors
    if (error) {
      logFormattedSupabaseError(error, status, statusText);
      return res.status(status).json(jsonErrorMsg("Error (Supabase)", error.message));
    }
    // if query produces a result return data, else provide error message
    validateQueryResultAndRespond(res, data, parameter);
  });
}

/**
 * @description returns average values of bpm, energy, danceability, loudness, liveness, valence, duration, acousticness, speechiness, popularity for the specified artist
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
*/
function handleAveragesForArtist(supabase, app) {
  app.get('/api/artists/averages/:ref', async (req, res) => {
    const parameter = req.params.ref;
    const {data, error, status, statusText} = await supabase 
      .from('songs')
      .select(
        `
        avg_bpm:bpm.avg(),
        avg_energy:energy.avg(),
        avg_danceability:danceability.avg(),
        avg_loudness:loudness.avg(),
        avg_liveness:liveness.avg(),
        avg_valence:valence.avg(),
        avg_duration:duration.avg(),
        avg_acousticness:acousticness.avg(),
        avg_speechiness:speechiness.avg(),
        avg_popularity:popularity.avg()
        `,
      )
      .eq('artist_id', parameter);
    // handle supabase errors
    if (error) {
      logFormattedSupabaseError(error, status, statusText);
      return res.status(status).json(jsonErrorMsg("Error (Supabase)", error.message));
    }
    // if query produces a result return data, else provide error message
    validateQueryResultAndRespond(res, data, parameter);
  });
}


/*--------------------------------------
/ SECTION: Module Exports
/-------------------------------------*/
module.exports = { 
  handleAll,
  handleByArtist,
  handleAveragesForArtist
};