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
    // handle supabase error
    if (error) {
      console.error(`Supabase error: ${error}`);
      return res.status(500).json(jsonErrorMsg(error.message));
    }
    // return the data
    res.status(200).json(data);
  });
}

/**
 * @description returns the specified artist (by the artist_id field)
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleByArtist(supabase, app) {
  app.get('/api/artists/:ref', async (req, res) => {
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
      .eq('artist_id', req.params.ref);
    // handle supabase error
    if (error) {
      console.error(`Supabase error: ${error}`);
      return res.status(500).json(jsonErrorMsg(error.message));
    }
    // if query produces a result return data, else provide error message
    if (data.length > 0) { 
      res.status(200).json(data);
    } else {
      res.status(404).json(jsonErrorMsg(
        `No artist match found for the artist_id ${req.params.ref}`
      ));
    }
  });
}

/**
 * @description returns average values of bpm, energy, danceability, loudness, liveness, valence, duration, acousticness, speechiness, popularity for the specified artist
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
*/
function handleAveragesForArtist(supabase, app) {
  app.get('/api/artists/averages/:ref', async (req, res) => {
    const { data, error } = await supabase
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
      .eq('artist_id', 2);
    // handle supabase error
    if (error) {
      console.error(`Supabase error: ${error}`);
      return res.status(500).json(jsonErrorMsg(error.message));
    }
    // if query produces a result return data, else provide error message
    if (data.length > 0) { 
      res.status(200).json(data);
    } else {
      res.status(404).json(jsonErrorMsg(
        `No artist match found for the artist_id ${req.params.ref}`
      ));
    }
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