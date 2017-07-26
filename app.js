var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
var DARKSKY_API_KEY = 'c861dc54a43dcc5756a3b065d1c354e7';
var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

var GOOGLE_MAPS_API_KEY = 'AIzaSyDO_SsPoFfg9cdieAEkqplQNqn9OmFUhPc';
var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';


// This function returns a promise that will resolve with an object of lat/lng coordinates
function getCoordinatesForCity(cityName) {
    // This is an ES6 template string, much better than verbose string concatenation...
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
        fetch(url) // Returns a promise for a Response
            .then(response => response.json()) // Returns a promise for the parsed JSON
            .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
    );
}

function getCurrentWeather(coords) {
    // Template string again! I hope you can see how nicer this is :)
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

    return (
        fetch(url)
            .then(response => response.json())
            .then(data => data.currently)
    );
}