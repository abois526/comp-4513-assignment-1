/**
 * @file Handles all endpoints for the songs data.
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
 * @description returns JSON for all songs sorted by title
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleAll(supabase, app) {
  app.get('/api/songs', async (req, res) => {
    const {data, error} = await supabase 
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
    // handle supabase error
    if (error) {
      logFormattedSupabaseError(error);
      return res.status(500).json(jsonErrorMsg(
        "Error (Supabase)",
        error.message
      ));
    }
    // return the data
    res.status(200).json(data);
  });
}

/**
 * @description returns all the songs sorted by order field (valid values include: song_id, title, artist (name), genre (name), year, duration)
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleByOrderField(supabase, app) {
  app.get('/api/songs/sort/:order', async (req, res) => {
    // set up syntax to order parent table by the referenced table
    let order = req.params.order;
    if (order === "artist_name") order = `artist(${order})`;
    if (order === "genre_name") order = `genre(${order})`;

    const {data, error} = await supabase 
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
      // handle supabase error
      if (error) {
        logFormattedSupabaseError(error);
        return res.status(500).json(jsonErrorMsg(
          "Error (Supabase)",
          error.message
        ));
      }
      // return the data
      res.status(200).json(data);
  });
}

/**
 * @description returns a specified song (by song_id field)
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleBySongId(supabase, app) {
  app.get('/api/songs/:ref', async (req, res) => {
    const {data, error} = await supabase 
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
      .eq('song_id', req.params.ref);
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
        `No song match found for the song_id ${req.params.ref}`
      ));
    }
  });
}

/**
 * @description returns all songs whose title (case-insensitive) beings with the provided substring
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleBeginsWithSubstring(supabase, app) {
  app.get('/api/songs/search/begin/:substring', async (req, res) => {
    const {data, error} = await supabase 
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
      .ilike('title', `${req.params.substring}%`);
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
        `No song matches found beginning with the substring ${req.params.substring}`
      ));
    }
  });
}

/**
 * @description returns all songs whose title (case-insensitive) contains the provided substring
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleContainsSubstring(supabase, app) {
  app.get('/api/songs/search/any/:substring', async (req, res) => {
    const {data, error} = await supabase 
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
      .ilike('title', `%${req.params.substring}%`);
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
        `No song matches found containing the substring ${req.params.substring}`
      ));
    }
  });
}

/**
 * @description returns all songs whose year is equal to the specified year
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleByYear(supabase, app) {
  app.get('/api/songs/search/year/:substring', async (req, res) => {
    const {data, error} = await supabase 
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
      .eq('year', req.params.substring);
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
        `No song matches found whose year is equal to ${req.params.substring}`
      ));
    }
  });
}

/**
 * @description returns all songs for the specified artist
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleByArtist(supabase, app) {
  app.get('/api/songs/artist/:ref', async (req, res) => {
    const {data, error} = await supabase 
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
      .eq('artist_id', req.params.ref);
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
        `No song matches found for the artist_id ${req.params.ref}`
      ));
    }
  });
}

/**
 * @description returns all songs for the specified genre
 * @param {Function} supabase the supabase client for interacting with the db
 * @param {Function} app the express application 
 */
function handleByGenre(supabase, app) {
  app.get('/api/songs/genre/:ref', async (req, res) => {
    const {data, error} = await supabase 
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
      .eq('genre_id', req.params.ref);
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
        `No song matches found for the genre_id ${req.params.ref}`
      ));
    }
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