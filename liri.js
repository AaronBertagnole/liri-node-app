require("dotenv").config()
var keys = require("./keys.js")
var axios = require("axios")
var Spotify = require("node-spotify-api")
var dateFormat = require("date-format")
var fs = require("fs")


//    takes an artist that you searched for shows if they are coming to your town.

var concertThis = function(artist){
var region = ""
var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
//console.log (queryUrl);
console.log(queryUrl);
axios(queryUrl, function(err,response,body){

    if(!err && response.statusCode === 200){
    var concertInfo = JSON.parse(body);


    outputData(artist + " Concert Information:")

    for (i=0; i< concertInfo.length; i++ ){
        
        region = concertInfo[i].venue.region

        if (region === " ") {
            region = concertInfo[i].venue.country
        }
        outputData("Venue: " + concertInfo[i].venue.name)
        outputData("Location: " + concertInfo[i].venue.city + " , " + region);
        outputData("Date: " + dateFormat(concertInfo[i].datetime, "mm/dd/yyyy"))
         }
    }    
  })
}

var outputData = function(data) {
    console.log(data);

    fs.appendFile("log.txt" , "\r\n" + data, function(err){
        if(err){ 
            return console.log(err);
        }
    })
}


var runAction = function(func, data) {
    switch (func){
        case "concertThis":
            concertThis(data)
            break
        default:
            outputData("I don't know what that means. Please try again.")    
    }
}

runAction(process.argv[2],process.argv[3],process.argv[4])