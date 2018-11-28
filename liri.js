
// Loads the dotenv package for use in reading the .env file which stores a hidden Spotify API key.
require("dotenv").config();

// Accesses the keys.js file and passes the Spotify Client ID and API Key.
var keys = require("./keys.js");

// Loads the node package for the Spotify API and links to the keys file.
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// Loads the package for reading and writing to the random.txt file.
var fs = require("fs");

// Loads the node package for simple HTTPS requests used with the OMDB API.
var request = require("request");

// ** BONUS **
// Output file and package for logging inputs.
var filename = './log.txt';
var log = require('simple-node-logger').createSimpleFileLogger( filename );
log.setLevel('all');

// Action requested.
var action = process.argv[2];

// Optional argument to request specific information.
// Based on action type.
var argument = "";

// Main function for determining the action to be taken and data input as an argument.
doSomething(action, argument);

// Switch operation used to determin which action to take.
function doSomething(action, argument) {

	// Allows the user to input a third argument if desired.
    argument = getThirdArgument();

    switch (action) {
        // Primary command to request song information from within the application.
        case "spotify-this-song":

            // First gets song title argument.
            var songTitle = argument;

            // If no song title provided, defaults to specific song.
            if (songTitle === "") {
                lookupSpecificSong();

                // Else looks up song based on song title.
            } else {
                // Get song information from Spotify.
                getSongInfo(songTitle);
                logOutput("You searched for: ' " + songTitle + " '");
            }
            break;

        // Primary command to request movie information from within the application.
        case "movie-this":

            // Sets movie title as the argument.
            var movieTitle = argument;

            // If no movie title provided, defaults to specific movie.
            if (movieTitle === "") {
                getMovieInfo("Mr. Nobody");

                // Else looks up song based on movie title.
            } else {
                getMovieInfo(movieTitle);
            }
            break;

        // Gets text inside file, and uses it to do something.
        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}

// Passes a query URL to OMDB to retrieve movie information for movie title.
// If no movie title provided, defaults to the movie, Mr. Nobody.
function getMovieInfo(movieTitle) {

    // Runs a request to the OMDB API with the movie specified.
    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&apikey=trilogy&y=&plot=short&tomatoes=true&r=json";

    request(queryUrl, function (error, response, body) {
        // If the request is successful...
        if (!error && response.statusCode === 200) {

            // Parses the body of the site and recovers movie info.
            var movie = JSON.parse(body);

            // Prints out movie info.
            logOutput("Movie Title: " + movie.Title);
            logOutput("Release Year: " + movie.Year);
            logOutput("IMDB Rating: " + movie.imdbRating);
            logOutput("Country Produced In: " + movie.Country);
            logOutput("Language: " + movie.Language);
            logOutput("Plot: " + movie.Plot);
            logOutput("Actors: " + movie.Actors);
            logOutput("You searched for: ' " + movieTitle + " '");
        }

        else 

        {
            // Notifies the user that the search failed and verifies the search.
            logOutput("You searched for: ' " + movieTitle + " '");
            logOutput("Failed. Try again.");
        }
    });
}

// Returns optional third argument, for example,
// when requesting song information, include a song title.
function getThirdArgument() {

    // Stores all possible arguments in array.
    argumentArray = process.argv;

    // Loops through words in node argument.
    for (var i = 3; i < argumentArray.length; i++) {
        argument += argumentArray[i];
    }
    return argument;
}

// Calls Spotify API to retrieve song information for song title.
function getSongInfo(songTitle) {

    // Calls Spotify API to retrieve a track.
    spotify.search({ type: 'track', query: songTitle }, function (err, data) {
        if (err) {
            logOutput.error(err);
            return
        }

        var artistsArray = data.tracks.items[0].album.artists;

        // Array to hold artist names, when more than one artist exists for a song.
        var artistsNames = [];

        // Pushes artists for track to array.
        for (var i = 0; i < artistsArray.length; i++) {
            artistsNames.push(artistsArray[i].name);
        }

        // Converts artists array to string, and makes it pretty.
        var artists = artistsNames.join(", ");

        // Prints the artist(s), track name, preview url, and album name.
        logOutput("Artist(s): " + artists);
        logOutput("Song: " + data.tracks.items[0].name)
        logOutput("Spotify Preview URL: " + data.tracks.items[0].preview_url)
        logOutput("Album Name: " + data.tracks.items[0].album.name);
    });



}

// When no song title provided, defaults to specific song, The Sign.
function lookupSpecificSong() {

    // Calls Spotify API to retrieve a specific track, The Sign, Ace of Base.
    spotify.search({ type: 'track', query: 'ace of base' }, function (err, data) {
        if (err) {
            logOutput.error(err);
            return
        }

        var artistsArray = data.tracks.items[0].album.artists;

        // Array to hold artist names, when more than one artist exists for a song.
        var artistsNames = [];

        // Pushes artists for track to array.
        for (var i = 0; i < artistsArray.length; i++) {
            artistsNames.push(artistsArray[i].name);
        }

        // Converts artists array to string, and makes it pretty.
        var artists = artistsNames.join(", ");

        // Prints the artist(s), track name, preview url, and album name.
        logOutput("Artist(s): " + artists);
        logOutput("Song: " + data.tracks.items[0].name)
        logOutput("Spotify Preview URL: " + data.tracks.items[0].preview_url)
        logOutput("Album Name: " + data.tracks.items[0].album.name);
    });
}

// Uses fs node package to take the text inside random.txt,
// and do something with it.
function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            logOutput.error(err);
        } else {

            // Creates array with data.
            var randomArray = data.split(",");

            // Sets action to first item in array.
            action = randomArray[0];

            // Sets optional third argument to second item in array.
            argument = randomArray[1];

            // Calls the main function to do something based on the action and argument.
            doSomething(action, argument);
        }
    });
}

// Simplifying function which logs all data outputs to the terminal. 
function logOutput(logText) {
    console.log(logText);

    // ** BONUS ** 
    // Outputs all user input to a separate log file.
    log.info(logText);
}




