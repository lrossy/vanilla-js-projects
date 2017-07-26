(function() {
  var API_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1';
  var API_KEY = '2ea81847c9b12c7f5276c33d1808a79e';
  var API_SECRET = '265e45f890c84e9c';
  var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  var pollingForData = false;
  var page = 1;
  var term;
  function getPhotosForSearch(term, page=1) {
    var url = `${API_URL}&api_key=${API_KEY}&text=${term}&page=${page}`;

    return (
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if(data.stat != 'ok') {
            return Promise.reject(new Error(data.message))
          }
          return data.photos.photo.map( photo => {
            return {
              thumb: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_t.jpg`,
              title: photo.title,
              large: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`
            }
          });
        })
    );
  }

  function createFlickrThumb(photoData) {
    var container = document.createElement('div');
    container.classList.add('col-sm-2');
    var link = document.createElement('a');
    link.setAttribute('href', photoData.large);
    link.setAttribute('target', '_blank');

    var image = document.createElement('img');
    image.setAttribute('src', photoData.thumb);
    image.setAttribute('alt', photoData.title);

    link.appendChild(image);

    container.appendChild(link);
    return container;
  }

  var app = document.querySelector('#app');
  var cityForm = app.querySelector('.city-form');
  var cityInput = cityForm.querySelector('.city-input');
  var getWeatherButton = cityForm.querySelector('.get-weather-button');
  var cityWeather = app.querySelector('.city-weather');

  cityForm.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent the form from submitting

    term = cityInput.value;

    cityWeather.innerText = 'loading...';
    getPhotosForSearch(term)
      .then(function(pictures) {
        cityWeather.innerText = '';
        pictures.forEach( (picture, idx) => {
          if(idx % 12 === 0){
            //make a new row
            container = document.createElement('row');
            cityWeather.appendChild(container);
          }
          var newImgThumb = createFlickrThumb(picture);
          container.appendChild(newImgThumb);
        });

      })
      .catch( e =>{
        cityWeather.innerText = e;
      })
  });

  function getDistFromBottom () {

    var scrollPosition = window.pageYOffset;
    var windowSize     = window.innerHeight;
    var bodyHeight     = document.body.offsetHeight;

    return Math.max(bodyHeight - (scrollPosition + windowSize), 0);

  }


  document.addEventListener('scroll', function() {
    distToBottom = getDistFromBottom();
    console.log('scrolling', getDistFromBottom());

    if (!pollingForData && distToBottom > 0 && distToBottom <= 100) {
      pollingForData = true;

      page++;
      getPhotosForSearch(term, page)
        .then(function(pictures) {
          cityWeather.innerText = '';
          pictures.forEach( (picture, idx) => {
            if(idx % 12 === 0){
              //make a new row
              container = document.createElement('row');
              cityWeather.appendChild(container);
            }
            var newImgThumb = createFlickrThumb(picture);
            container.appendChild(newImgThumb);
          });

        })
        .catch( e =>{
          cityWeather.innerText = e;

        }).then( r => {
        pollingForData = false;
      });

    }
  });

})();