require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var fs = require("fs");

//    takes an artist that you searched for shows if they are coming to your town.

var concertThis = function (artist) {
  //default is metallica just for fun
  if (!artist) {
    artist = "Metallica";
  }
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        artist +
        "/events?app_id=codingbootcamp"
    )
    .then(function (response) {
      for (var i = 0; i < response.data.length; i++) {
        outputData("Venue: " + response.data[i].venue.name);
        outputData(
          "Location: " +
            response.data[i].venue.city +
            ", " +
            response.data[i].venue.country
        );
        outputData("Date: " + moment(response.data[i].datetime).format("L"));
      }
    });
};

var spotifyThisSong = function (song) {
  //default is Ace of Spades
  if (!song) {
    song = "The sign Ace of Base";
  }

  var spotify = new Spotify(keys.spotify);

  spotify.search({ type: "track", query: song, limit: 3 }, function (
    err,
    data
  ) {
    if (err) {
      return console.log(err);
    }

    var songInfo = data.tracks.items[0];
    outputData(songInfo.artists[0].name);
    outputData(songInfo.name);
    outputData(songInfo.album.name);
    outputData(songInfo.preview_url);
  });
};

var movieThis = function (movie) {
  if (!movie) {
    movie = "Mr.+Nobody";
  }

  axios
    .get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
    .then(function (response) {
      outputData("Title : " + response.data.Title);
      outputData("Release Year: " + response.data.Year);
      outputData("imdbRating: " + response.data.imdbRating);
      outputData("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      outputData("Country: " + response.data.Country);
      outputData("Language: " + response.data.Language);
      outputData("Plot: " + response.data.Plot);
      outputData("Actors: " + response.data.Actors);
    });
};

var outputData = function (data) {
  console.log(data);

  fs.appendFile("log.txt", "\r\n" + data, function (err) {
    if (err) {
      return console.log(err);
    }
  });
};

var runAction = function (func, data) {
  switch (func) {
    case "concert-this":
      concertThis(data);
      break;
    case "spotify-this-song":
      spotifyThisSong(data);
      break;
    case "movie-this":
      movieThis(data);
      break;
    default:
      outputData("I don't know what that means. Please try again.");
  }
};

runAction(process.argv[2], process.argv[3]);
