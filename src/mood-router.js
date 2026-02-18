/**
 * @file Handles all endpoints for the mood data.
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
 * @description returns JSON data for the top number of songs sorted by danceability in descending order (number of songs determined by the ref parameter and defaults to 20)
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleDancing(supabase, app) {
  app.get('/api/mood/dancing{/:ref}', async (req, res) => {
    let ref = req.params.ref;
    if (ref) {
      // check if value within 1-20, default to 20 if not else keep value
      ref = (ref < 1 || ref > 20) ? 20 : ref;
    } else {
      // default to 20 if not provided 
      ref = 20;
    }
    const { data, error } = await supabase
      .from('songs')
      .select(`
        song_id,
        title,
        artist:artists!inner(artist_id, artist_name),
        genre:genres!inner(genre_id, genre_name),
        year,
        bpm,
        energy,
        danceability,
        loudness,
        liveness,
        valence,
        duration,
        acousticness,
        speechiness,
        popularity
      `)
      .order('danceability', {
        ascending: false,
      })
      .limit(ref);
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
        "No song matches found for the mood dancing"
      ));
    }
  });
}

/**
 * @description returns JSON data for the top number of songs sorted by valence in descending order (number of songs determined by the ref parameter and defaults to 20)
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleHappy(supabase, app) {
  app.get('/api/mood/happy{/:ref}', async (req, res) => {
    let ref = req.params.ref;
    if (ref) {
      // check if value within 1-20, default to 20 if not else keep value
      ref = (ref < 1 || ref > 20) ? 20 : ref;
    } else {
      // default to 20 if not provided 
      ref = 20;
    }
    const { data, error } = await supabase
      .from('songs')
      .select(`
        song_id,
        title,
        artist:artists!inner(artist_id, artist_name),
        genre:genres!inner(genre_id, genre_name),
        year,
        bpm,
        energy,
        danceability,
        loudness,
        liveness,
        valence,
        duration,
        acousticness,
        speechiness,
        popularity
      `)
      .order('valence', {
        ascending: false,
      })
      .limit(ref);
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
        "No song matches found for the mood dancing"
      ));
    }
  });
}

/**
 * @description returns JSON data for the top number of songs sorted by liveness divided by acousticness in descending order (number of songs determined by the ref parameter and defaults to 20); calls a Postgres function as PostgREST doesn't support the more complex query
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleCoffee(supabase, app) {
  app.get('/api/mood/coffee{/:ref}', async (req, res) => {
    let ref = req.params.ref;
    if (ref) {
      // check if value within 1-20, default to 20 if not else keep value
      ref = (ref < 1 || ref > 20) ? 20 : ref;
    } else {
      // default to 20 if not provided 
      ref = 20;
    }
    const { data, error } = await supabase
      .rpc(
        'top_songs_coffee',
        {limit_count: ref}
      );
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
        "No song matches found for the mood coffee"
      ));
    }
  });
}

/**
 * @description returns JSON data for the top number of songs sorted by the product of the energy and speechiness parameters in descending order (number of songs determined by the ref parameter and defaults to 20); calls a Postgres function as PostgREST doesn't support the more complex query
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleStudying(supabase, app) {
  app.get('/api/mood/studying{/:ref}', async (req, res) => {
    let ref = req.params.ref;
    if (ref) {
      // check if value within 1-20, default to 20 if not else keep value
      ref = (ref < 1 || ref > 20) ? 20 : ref;
    } else {
      // default to 20 if not provided 
      ref = 20;
    }
    const { data, error } = await supabase
      .rpc(
        'top_songs_studying',
        {limit_count: ref}
      );
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
        "No song matches found for the mood coffee"
      ));
    }
  });
}

/*--------------------------------------
/ SECTION: Module Exports
/-------------------------------------*/
module.exports = {
  handleDancing,
  handleHappy,
  handleCoffee,
  handleStudying
};