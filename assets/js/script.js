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
        })
        .then(function() {
            setTimeout(displayBreweryHandler(), 2000);
        })
    })
    
}

//Get array of restaurants
var getRestaurants = function() {
    var almostSearchableCity = city.toLowerCase();
    var searchableCity = almostSearchableCity.replace(/ /g, "%20");
    fetch("https://api.opencagedata.com/geocode/v1/json?q=" + searchableCity + "&key=7d27afefb2e045c994d1e56220e4dc26")
    .then(function(response) {
        response.json()
        .then(function(data) {
            lat = data.results[0].geometry.lat;
            long = data.results[0].geometry.lng;
        })
        .then(function() {
            fetch("https://developers.zomato.com/api/v2.1/search?lat=" + lat + "&lon=" + long + "&apikey=510b377da1e68430bb8e2db41707b969")
            .then(function(response) {
                response.json()
                .then(function(data) {
                    restaurants = data.restaurants
                })
                .then(function() {
                    setTimeout(displayRestaurantHandler(), 1000);
                })
            })
        })
    })
};

//function if location permission was given, gets users city
var successCallback = function(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    fetch("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=7d27afefb2e045c994d1e56220e4dc26")
    .then(function(response) {
        response.json()
        .then(function(data) {
            city = data.results[0].components.town;
            searchInput.value += city;
        })
    })
};

//function if location permission was not given
var errorCallback = function(error) {
    console.log(error);
    console.log("Location access was denied.");
};

//function to handle search bar
var searchHandler = function() {
    city = searchInput.value
    if ( city == "") {
        M.toast({html: 'Looks like you forgot to enter a location.'})
    }
    if (document.querySelector("#restaurant-checkbox").checked) {
        resultsArea.classList.remove("hidden");
        var breweryContainer = document.querySelector("#brewery-container");
        breweryContainer.setAttribute("class", "hidden");
        getRestaurants();
    }
    if (document.querySelector("#brewery-checkbox").checked) {
        resultsArea.classList.remove("hidden");
        var restaurantContainer = document.querySelector("#restaurant-container");
        restaurantContainer.setAttribute("class", "hidden");
        getBreweries();
    } else if (!(document.querySelector("#restaurant-checkbox").checked) && !(document.querySelector("#brewery-checkbox").checked)) {
        M.toast({html: 'Please select at least one option!', classes: 'rounded'})
    };
};

//function to handle displaying search results
var displayRestaurantHandler = function() {
    var restaurantContainer = document.querySelector("#restaurant-container");
    restaurantContainer.classList.remove("hidden");
    var currentRestaurantList = document.querySelector("#restaurant-list");

    if (restaurants.length === 0) {
        var noResults = document.createElement("p");
        noResults.setAttribute("id", "restaurant-list");
        noResults.setAttribute("class", "no-results-alert")
        noResults.textContent = "Sorry, no restaurants found near that location."
        currentRestaurantList.replaceWith(noResults);
    }
    else {
        var newRestaurantsList = document.createElement("ul");
        newRestaurantsList.setAttribute("id", "restaurant-list");
        currentRestaurantList.replaceWith(newRestaurantsList);
    
        for (i = 0; i < restaurants.length; i++) {
            var restaurantItem = document.createElement("a");
            restaurantItem.setAttribute("class", "list-item");
            restaurantItem.textContent = restaurants[i].restaurant.name;
            newRestaurantsList.appendChild(restaurantItem);
        };
    };
};

var displayBreweryHandler = function() {
    var breweryContainer = document.querySelector("#brewery-container");
    breweryContainer.classList.remove("hidden");
    var currentBreweryList = document.querySelector("#brewery-list");

    if (breweries.length === 0) {
        var noResults = document.createElement("p");
        noResults.setAttribute("id", "brewery-list");
        noResults.setAttribute("class", "no-results-alert")
        noResults.textContent = "Sorry, no breweries found near that location."
        currentBreweryList.replaceWith(noResults);
    }
    else {
        var newBreweryList = document.createElement("ul");
        newBreweryList.setAttribute("id", "brewery-list");
        currentBreweryList.replaceWith(newBreweryList);
    
        for (i = 0; i < breweries.length; i++) {
            var breweryItem = document.createElement("a");
            breweryItem.setAttribute("class", "list-item");
            breweryItem.textContent = breweries[i].name;
            newBreweryList.appendChild(breweryItem);
        };
    };
};





//ask to get users location
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

searchButton.addEventListener("click", searchHandler);