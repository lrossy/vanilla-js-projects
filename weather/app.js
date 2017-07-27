(function() {
  var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  var DARKSKY_API_KEY = 'c861dc54a43dcc5756a3b065d1c354e7';
  var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  var GOOGLE_MAPS_API_KEY = 'AIzaSyByHd1VnqCDt17O8vQ2gBRj8vOSr8EsUiU';
  var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

  function getCurrentWeather(coords) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}`;

    console.log('url', url);
    return (
      fetch(url)
        .then(response => response.json())
        .then(data => data.currently)
    );
  }

  function getCoordinatesForCity(cityName) {
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      fetch(url)
        .then(response => response.json())
        .then(data => data.results[0].geometry.location)
    );
  }

  var app = document.querySelector('#app');
  var cityForm = app.querySelector('.city-form');
  var cityInput = cityForm.querySelector('.city-input');
  var getWeatherButton = cityForm.querySelector('.get-weather-button');
  var cityWeather = app.querySelector('.city-weather');

  cityForm.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent the form from submitting

    var city = cityInput.value;
    //
    cityWeather.innerText = 'loading...';
    getCoordinatesForCity(city)
      .then(getCurrentWeather)
      .then(function(weather) {
        cityWeather.innerText = 'Current temperature: ' + weather.temperature;
      })
      .catch( e =>{
        cityWeather.innerText = 'There was a problem, try again in a few minutes';
      })
  });
})();