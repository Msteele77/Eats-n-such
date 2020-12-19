var lat = "";
var long ="";
var city = "";
var breweries = [];
var restaurants = [];
var searchInput = document.querySelector("#city-search");
var searchButton = document.querySelector("#search-button");
var resultsArea = document.querySelector("#results-section");



//Get array of breweries
var getBreweries = function() {
    var almostSearchableCity = city.toLowerCase();
    var searchableCity = almostSearchableCity.replace(/ /g, "_");
    fetch("https://api.openbrewerydb.org/breweries?by_city=" + searchableCity)
    .then(function(response) {
        response.json()
        .then(function(data) {
            breweries = data
            console.log(breweries);
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
            console.log(restaurants);
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
            console.log(city);
            searchInput.value += city;
        })
    })
}

//function if location permission was not given
var errorCallback = function(error) {
    console.log(error);
    console.log("Location access was denied.");
}

//function to handle search bar
var searchHandler = function() {
    city = searchInput.value
    if (document.querySelector("#restaurant-checkbox").checked) {
        getRestaurants();
        displayRestaurantHandler();
    }
    if (document.querySelector("#brewery-checkbox").checked) {
        getBreweries();
        displayBreweryHandler();
    } else if (!(document.querySelector("#restaurant-checkbox").checked) && !(document.querySelector("#brewery-checkbox").checked)) {
        M.toast({html: 'Please select at least one option!', classes: 'rounded'})
    };
}

//function to handle displaying search results
var displayRestaurantHandler = function() {
    console.log('worked')
    var restaurantList = document.createElement("ul");
    var restaurantsTag = document.createElement("h5");
    restaurantsTag.textContent = "Restaurants Near You: "
    resultsArea.append(restaurantsTag);
}

var displayBreweryHandler = function() {
    console.log('also worked')
    var breweryList = document.createElement("ul");
    var breweryTag = document.createElement("h5");
    breweryTag.textContent = "Breweries Near You: "
    resultsArea.append(breweryTag);
}



//ask to get users location
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

searchButton.addEventListener("click", searchHandler);