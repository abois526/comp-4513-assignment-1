# Supabase Spotify API
> REST-like API for hit Spotify songs utilizing a Postgres database hosted on Supabase

## Overview
This is a REST-like API that serves JSON data for different artists, genres, songs, playlists, and mood categories. Multiple routes are provided that allow users to retrieve all of the available resources for a given category, or to filter them by various parameters. 

**Link to base URL:** https://supabase-spotify-api.onrender.com

**Built With:** Node.js, Express.js, Supabase

## Details
Basic use of HTTP response status codes is handled:
- Requests for valid routes result in a 200 OK status code.
- Requests for invalid routes result in a 404 Not Found status code, along with an error message.
- Requests for valid routes that are filtered by a parameter which result in no found resources result in a 404 Not Found status code and a detailed error message in JSON format is returned to the user.
- Requests resulting in a Supabase error, such as providing an invalid data type as a parameter, result in a 500 Internal Server Error status code, error details being logged, and a detailed error message in JSON format provided by the `error.message` value

The project is hosted on Render and routes must be appended to the base URL to access the data. It is hosted using the hobby plan which sleeps after 15 minutes of inactivity, so the first request may take a moment while the web service starts up again if it hasn't been recently used. 

The database is hosted on Supabase on the free plan. These projects go inactive after one week, though this will be monitored to ensure access is available.

## Usage
### Available API Endpoints
| API Endpoint | Description |
|-|-|
| /api/artists | Returns all data for all artists sorted by artist_name. |
| /api/artists/`ref` | Returns the specified artist (using the artist_id field) |
| /api/artists/averages/`ref` | Returns the varage values for bpm, energy, danceability, loudness, liveness, valence, duration, acousticness, speechiness, and popularity for the specified artist |
| /api/genres | Returns all the genres |
| /api/songs | Returns all data for all the songs, sorted by song title |
| /api/songs/sort/`order` | Returns all the songs, sorted by the order field (using song_id, title, artist(artist_name), genre(genre_name), year, or duration) |
| /api/songs/`ref` | Returns the specified song (using the song_id field) |
| /api/songs/search/begin/`substring` | Returns the songs whose title (case insensitive) begins with the provided substring |
| /api/songs/search/any/`substring` | Returns the songs whose title (case insensitive) contains the provided substring |
| /api/songs/search/year/`substring` | Returns the songs whose year is equal to the provided substring | 
| /api/songs/artist/`ref` | Returns all the songs for the specified artist (using the artist_id field) |
| /api/songs/genre/`ref` | Returns all the songs for the specified genre (using the genre_id field) |
| /api/playlists/`ref` | Returns all the songs for a specified playlist (using the playlist_id field) |
| /api/mood/dancing/`ref` | Returns the top number of songs, sorted by danceability in descending order. The number of results is determined by the ref parameter and defaults to 20 results if the number is missing, is less than 1, or is greater than 20. |
| /api/mood/happy/`ref` | Returns the top number of songs, sorted by valence in descending order. The number of results is determined by the ref parameter and defaults to 20 results if the number is missing, is less than 1, or is greater than 20. |
| /api/mood/coffee/`ref` | Returns the top number of songs, sorted by liveness divided by acousticness in descending order. The number of results is determined by the ref parameter and defaults to 20 results if the number is missing, is less than 1, or is greater than 20. Records with an acousticness value of 0 are sorted by only liveness to maintain constistency with the sorting logic. |
| /api/mood/studying/`ref` | Returns the top number of songs, sorted by the product of energy and speechiness in descending order. The number of results is determined by the ref parameter and defaults to 20 results if the number is missing, is less than 1, or is greater than 20. |

### Example Response 
**Request:** `/api/songs/1010`

**Response:**
```json
[
  {
    "song_id": 1010,
    "title": "MIA (feat. Drake)",
    "year": 2018,
    "bpm": 97,
    "energy": 54,
    "danceability": 82,
    "loudness": -6,
    "liveness": 10,
    "valence": 16,
    "duration": 210,
    "acousticness": 1,
    "speechiness": 6,
    "popularity": 82,
    "artist": {
      "artist_id": 15,
      "artist_name": "Bad Bunny"
    },
    "genre": {
      "genre_id": 117,
      "genre_name": "latin"
    }
  }
]
```

### Example API Requests
| Links |
|-|
| [/api/artists](https://supabase-spotify-api.onrender.com/api/artists) |
| [/api/artists/129](https://supabase-spotify-api.onrender.com/api/artists/129) |
| [/api/artists/sdfjkhsdf](https://supabase-spotify-api.onrender.com/api/artists/sdfjkhsdf) |
| [/api/artists/averages/129](https://supabase-spotify-api.onrender.com/api/artists/averages/129) |
| [/api/genres](https://supabase-spotify-api.onrender.com/api/genres) |
| [/api/songs](https://supabase-spotify-api.onrender.com/api/songs) |
| [/api/songs/sort/artist](https://supabase-spotify-api.onrender.com/api/songs/sort/artist) |
| [/api/songs/sort/year](https://supabase-spotify-api.onrender.com/api/songs/sort/year) |
| [/api/songs/sort/duration](https://supabase-spotify-api.onrender.com/api/songs/sort/duration) |
| [/api/songs/1010](https://supabase-spotify-api.onrender.com/api/songs/1010) |
| [/api/songs/sjdkfhsdkjf](https://supabase-spotify-api.onrender.com/api/songs/sjdkfhsdkjf) |
| [/api/songs/search/begin/love](https://supabase-spotify-api.onrender.com/api/songs/search/begin/love) |
| [/api/songs/search/begin/sdjfhs](https://supabase-spotify-api.onrender.com/api/songs/search/begin/sdjfhs) |
| [/api/songs/search/any/love](https://supabase-spotify-api.onrender.com/api/songs/search/any/love) |
| [/api/songs/search/year/2017](https://supabase-spotify-api.onrender.com/api/songs/search/year/2017) |
| [/api/songs/search/year/2027](https://supabase-spotify-api.onrender.com/api/songs/search/year/2027) |
| [/api/songs/artist/149](https://supabase-spotify-api.onrender.com/api/songs/artist/149) |
| [/api/songs/artist/7834562](https://supabase-spotify-api.onrender.com/api/songs/artist/7834562) |
| [/api/songs/genre/115](https://supabase-spotify-api.onrender.com/api/songs/genre/115) |
| [/api/playlists](https://supabase-spotify-api.onrender.com/api/playlists) |
| [/api/playlists/3](https://supabase-spotify-api.onrender.com/api/playlists/3) |
| [/api/playlists/35362](https://supabase-spotify-api.onrender.com/api/playlists/35362) |
| [/api/mood/dancing/5](https://supabase-spotify-api.onrender.com/api/mood/dancing/5) |
| [/api/mood/dancing/500](https://supabase-spotify-api.onrender.com/api/mood/dancing/500) |
| [/api/mood/dancing/ksdjf](https://supabase-spotify-api.onrender.com/api/mood/dancing/ksdjf) |
| [/api/mood/happy/8](https://supabase-spotify-api.onrender.com/api/mood/happy/8) |
| [/api/mood/happy](https://supabase-spotify-api.onrender.com/api/mood/happy) |
| [/api/mood/coffee/10](https://supabase-spotify-api.onrender.com/api/mood/coffee/10) |
| [/api/mood/studying/15](https://supabase-spotify-api.onrender.com/api/mood/studying/15) |