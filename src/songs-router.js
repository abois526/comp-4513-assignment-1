/**
 * @file Handles all endpoints for the songs data.
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
 * @description returns JSON for all songs sorted by title
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleAll(supabase, app) {
  app.get('/api/songs', async (req, res) => {
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
      .order('title', {ascending: true});
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
 * @description returns all the songs sorted by order field (valid values include: song_id, title, artist (name), genre (name), year, duration)
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleByOrderField(supabase, app) {
  app.get('/api/songs/sort/:order', async (req, res) => {
    const parameter = req.params.order;
    // format input reference columns properly
    let order = "";
    switch (parameter) {
      case "id":
        order = "song_id";
        break;
      case "artist":
        order = `artist(artist_name)`;
        break;
      case "genre":
        order = `genre(genre_name)`;
        break;
      default:
        order = parameter;
        break;
    }

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
        .order(order, {ascending: true});
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
 * @description returns a specified song (by song_id field)
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleBySongId(supabase, app) {
  app.get('/api/songs/:ref', async (req, res) => {
    const parameter = req.params.ref;
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
      .eq('song_id', parameter);
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
 * @description returns all songs whose title (case-insensitive) beings with the provided substring
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleBeginsWithSubstring(supabase, app) {
  app.get('/api/songs/search/begin/:substring', async (req, res) => {
    const parameter = req.params.substring;
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
      .ilike('title', `${parameter}%`);
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
 * @description returns all songs whose title (case-insensitive) contains the provided substring
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleContainsSubstring(supabase, app) {
  app.get('/api/songs/search/any/:substring', async (req, res) => {
    const parameter = req.params.substring;
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
      .ilike('title', `%${parameter}%`);
    // handle supabase error
    if (error) {
      logFormattedSupabaseError(error);
      return res.status(400).json(jsonErrorMsg(
        "Error (Supabase)",
        error.message
      ));
    }
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
 * @description returns all songs whose year is equal to the specified year
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleByYear(supabase, app) {
  app.get('/api/songs/search/year/:substring', async (req, res) => {
    const parameter = req.params.substring;
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
      .eq('year', parameter);
    // handle supabase errors
    if (error) {
      logFormattedSupabaseError(error, status, statusText);
      return res.status(status).json(jsonErrorMsg("Error (Supabase)", error.message));
    }
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
 * @description returns all songs for the specified artist
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleByArtist(supabase, app) {
  app.get('/api/songs/artist/:ref', async (req, res) => {
    const parameter = req.params.ref;
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
 * @description returns all songs for the specified genre
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleByGenre(supabase, app) {
  app.get('/api/songs/genre/:ref', async (req, res) => {
    const parameter = req.params.ref;
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
      .eq('genre_id', parameter);
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
  handleAll,
  handleByOrderField,
  handleBySongId,
  handleBeginsWithSubstring,
  handleContainsSubstring,
  handleByYear,
  handleByArtist,
  handleByGenre
};