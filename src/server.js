/**
 * @file Sets up the Express API for hit songs on Spotify between 2016-2019
 * @author Andrew Boisvert <abois526@mtroyal.ca>
 */

/*--------------------------------------
/ SECTION: Module Imports and Declarations
/-------------------------------------*/
const express = require("express");
const app = express();
const supa = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();
const artists = require('./artists-router.js');
const genres = require('./genres-router.js');
const songs = require('./songs-router.js');
const playlists = require('./playlists-router.js');
const moods = require('./mood-router.js');

/*--------------------------------------
/ SECTION: Main Code
/-------------------------------------*/
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supa.createClient(supabaseUrl, supabaseKey);

// artists endpoints
artists.handleAll(supabase, app);
artists.handleByArtist(supabase, app);
artists.handleAveragesForArtist(supabase, app);

// genres endpoints
genres.handleAll(supabase, app);

// songs endpoints
songs.handleAll(supabase, app);
songs.handleByOrderField(supabase, app);
songs.handleBySongId(supabase, app);
songs.handleBeginsWithSubstring(supabase, app);
songs.handleContainsSubstring(supabase, app);
songs.handleByYear(supabase, app);
songs.handleByArtist(supabase, app);
songs.handleByGenre(supabase, app);

// playlists endpoints
playlists.handleAll(supabase, app);

// moods endpoints
moods.handleDancing(supabase, app);
moods.handleHappy(supabase, app);
moods.handleCoffee(supabase, app);
moods.handleStudying(supabase, app);

// display 404 error for any invalid endpoint requests
handleInvalidRequests(); 

// use express app to listen to the port
const port = process.env.PORT || 8080; // default to 8080
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

/*--------------------------------------
/ SECTION: Functions
/-------------------------------------*/
/**
 * @description handles invalid requests by setting 404 HTTP status and sending a message to the client 
 */
function handleInvalidRequests() {
  app.use((req, res) => {
    res.status(404).send("404 Not Found: Unable to find the requested resource.");
  });
}