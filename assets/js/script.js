var lat = "";
var long ="";
var city = "";
var breweries = [];
var restaurants = [];
var searchInput = document.querySelector("#city-search");
var searchButton = document.querySelector("#search-button");
var resultsArea = document.querySelector("#results-section");
var pastSearchItemArea = document.querySelector("#past-searches");



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
            setTimeout(displayBreweryHandler(), 1000);
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
                    setTimeout(displayRestaurantHandler(), 0);
                })
            })
        })
    })
};

//function if location permission was given, gets users city, pastes it in textarea
var successCallback = function(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    fetch("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=7d27afefb2e045c994d1e56220e4dc26")
    .then(function(response) {
        response.json()
        .then(function(data) {
            city = data.results[0].components.city;
            if (city === undefined) {
                city = data.results[0].components.town;
            }
            searchInput.value += city;
        })
    })
};

//function if location permission was not given. This really only exists because geolocation requires 2 parameters
var errorCallback = function(error) {
    console.log(error);
    console.log("Location access was denied.");
};

var storageHandler = function() {  
    city = searchInput.value
    var pastList = localStorage.getItem("searched");
    if (pastList) {
        var searchArray = pastList.split(",");
        if (!(searchArray.includes(city.toLowerCase()))) {
             if (searchArray.length > 4) {
                searchArray.shift();
                searchArray.push(city.toLowerCase());
                localStorage.setItem("searched", searchArray);
                searchHandler()
            }
            else {
                searchArray.push(city.toLowerCase());
                localStorage.setItem("searched", searchArray);
                searchHandler()
            };
        }
        else {
            searchHandler();
        }
    }
    else {
         localStorage.setItem("searched", city.toLowerCase());
         searchHandler()
    };
};

//function to handle search bar and checkbox selection
var searchHandler = function() {
    if (!(city)) {
        M.toast({html: 'Looks like you forgot to enter a location.', classes: 'rounded'})
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

//function to handle displaying restaurant search results 
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

//function to handle displaying brewery search results
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

//create past searches list
var pastSearches = function() {
    var pastListString = localStorage.getItem("searched");
    var pastList = pastListString.split(",")
    if ((pastList)) {
        var newSearchListArea = document.createElement("ul");
        newSearchListArea.setAttribute("id", "past-searches");

        for (i = 0; i < pastList.length; i++) {
            var searchListItem = document.createElement("a");
            searchListItem.setAttribute("class", "past-search-item");
            searchListItem.textContent = pastList[i];
            newSearchListArea.append(searchListItem);
        }
        var oldSearchListArea = document.querySelector("#past-searches");
        oldSearchListArea.replaceWith(newSearchListArea);
        pastSearchItemArea.classList.remove("hidden");
    };
};


//ask to get users location
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

searchButton.addEventListener("click", storageHandler);
searchInput.addEventListener("click", pastSearches);
document.addEventListener("click", function(event) {
    if ( event.target.closest(".past-search-item")) {
        var clickedItemText = event.toElement.innerText;
        searchInput.value = clickedItemText;
    }
});