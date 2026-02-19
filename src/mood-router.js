/**
 * @file Handles all endpoints for the mood data.
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
 * @description returns JSON data for the top number of songs sorted by danceability in descending order (number of songs determined by the ref parameter and defaults to 20)
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleDancing(supabase, app) {
  app.get('/api/mood/dancing{/:ref}', async (req, res) => {
    let parameter = req.params.ref;
    // if of type number then validate, else send error response
    parameter = validateParameterAndHandleErrors(res, parameter);
    // exit if error response has happened
    if (isNaN(parameter)) return; 
    const {data, error, status, statusText} = await supabase 
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
      .limit(parameter);
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
 * @description returns JSON data for the top number of songs sorted by valence in descending order (number of songs determined by the ref parameter and defaults to 20)
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleHappy(supabase, app) {
  app.get('/api/mood/happy{/:ref}', async (req, res) => {
    let parameter = req.params.ref;
    // if of type number then validate, else send error response
    parameter = validateParameterAndHandleErrors(res, parameter);
    // exit if error response has happened
    if (isNaN(parameter)) return; 
    // check if parameter exists and is within bounds, set default if not
    parameter = validateParameterAndHandleErrors(req.params.ref);
    const {data, error, status, statusText} = await supabase 
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
      .limit(parameter);
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
 * @description returns JSON data for the top number of songs sorted by liveness divided by acousticness in descending order (number of songs determined by the ref parameter and defaults to 20); calls a Postgres function as PostgREST doesn't support the more complex query
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleCoffee(supabase, app) {
  app.get('/api/mood/coffee{/:ref}', async (req, res) => {
    let parameter = req.params.ref;
    // if of type number then validate, else send error response
    parameter = validateParameterAndHandleErrors(res, parameter);
    // exit if error response has happened
    if (isNaN(parameter)) return; 
    const {data, error, status, statusText} = await supabase 
      .rpc(
        'top_songs_coffee',
        {limit_count: parameter}
      );
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
 * @description returns JSON data for the top number of songs sorted by the product of the energy and speechiness parameters in descending order (number of songs determined by the ref parameter and defaults to 20); calls a Postgres function as PostgREST doesn't support the more complex query
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleStudying(supabase, app) {
  app.get('/api/mood/studying{/:ref}', async (req, res) => {
    let parameter = req.params.ref;
    // if of type number then validate, else send error response
    parameter = validateParameterAndHandleErrors(res, parameter);
    // exit if error response has happened
    if (isNaN(parameter)) return; 
    const {data, error, status, statusText} = await supabase 
      .rpc(
        'top_songs_studying',
        {limit_count: parameter}
      );
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
 * @description validates the query parameter by checking if it exists and is within bounds, assigning a default value if either condition is false; handles errors when the parameter is not of type number (must perform isNaN check and exit after Fn call)
 * @param {String} parameter the parameter from req.params.ref
 * @returns if of type number the parameter in a validated format, else NaN
 */
function validateParameterAndHandleErrors(res, parameter) {
  // check if parameter exists, defaulting to 20 if not
  if (parameter) {
    // check if parameter is of type number
    parameter = parseInt(parameter);
    if (isNaN(parameter)) {
      res.status(400).json(jsonErrorMsg(
        "Error (Not Found)",
        `Invalid parameter syntax for type number: ${parameter}`
      ));
      return NaN;
    }
    // check if value within 1-20; default to 20 if not, else keep value
    parameter = (parameter < 1 || parameter > 20) ? 20 : parameter;
  } else {
    parameter = 20;
  }
  return parameter;
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