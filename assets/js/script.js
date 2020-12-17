var lat = "";
var long ="";
var city = "";
var breweries = [];
var restaurants = [];



//Get array of breweries
var getBreweries = function() {
    var almostSearchableCity = city.toLowerCase();
    var searchableCity = almostSearchableCity.replace(/ /g, "_");
    fetch("https://api.openbrewerydb.org/breweries?by_city=" + searchableCity)
    .then(function(response) {
        response.json()
        .then(function(data) {
            breweries = data
        })
    })
}

//Get array of restaurants
var getRestaurants = function() {
    fetch("https://developers.zomato.com/api/v2.1/search?lat=" + lat + "&lon=" + long + "&apikey=510b377da1e68430bb8e2db41707b969")
    .then(function(response) {
        response.json()
        .then(function(data) {
            restaurants = data.restaurants
        })
    })
}

//function if location permission was given, gets users city
var successCallback = function(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    fetch("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=7d27afefb2e045c994d1e56220e4dc26")
    .then(function(response) {
        response.json()
        .then(function(data) {
            city = data.results[0].components.town;
        })
    })
}

//function if location permission was not given
var errorCallback = function(error) {
    console.log(error);
}

//ask to get users location
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);



//getRestaurants();
//getBreweries();
//getLocation()