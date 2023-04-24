// dayjs for weather widget
var today = dayjs();

var dayWeek = today.format('ddd');
$('#today').text(dayWeek);

var tomorrow = today.add(1, 'days');

$('#tomorrow').text(tomorrow.format('ddd'));

var twodays = today.add(2, 'days');
$('#2days').text(twodays.format('ddd'));

var threedays = today.add(3, 'days');
$('#3days').text(threedays.format('ddd'));


// adding weather api
// var requestUrl = "https://api.open-meteo.com/v1/forecast?" + LAT.var + LONG.var + "daily=weathercode,temperature_2m_max,precipitation_probability_max,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago"

var responseText = document.getElementById('response-text');
var parkHead = document.getElementById('park-title')
var parkFacts = document.getElementById('parkinfo')
var parkImg = document.getElementById('parkPicture')

function getApi(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            console.log(response);

            return response.json();
        });
}

// getApi(requestUrl);

// adding national parks api
var apiKey = "BDfajyEhltU1a2tl5CuDG7MpyjVByr4sITJOfWP0"
var apiBase = "https://developer.nps.gov/api/v1/"

// park info
var park = {
    name: "",
    code: "",
    imageUrl: "",
    imageAlt: "",
    descript: "",
    fee: "",
    hours: "",
    weather: "",
    lat: "",
    long: ""
}

var parkHistory = []

// campground stuff
// array
var campground = {
    name: [],
    url: []
};
function getHistory() {
    var parksStored = JSON.parse(localStorage.getItem("parkHistory"))
    return parksStored
}

function getIndex(parkCurrent) {
    var pIndex = -5
    for (var i = 0; i < parkHistory.length; i++) {
        if(parkHistory[i].code === parkCurrent.code) {
            pIndex = i
        }
    }
    return pIndex
}

function getCurrent() {
    var parkCurrent = JSON.parse(localStorage.getItem("parkCurrent"))
    parkHead.textContent = parkCurrent.name

    parkHistory = getHistory()
    var pIndex = getIndex(parkCurrent)
    park.name = parkHistory[pIndex].name
    park.code = parkHistory[pIndex].code
    park.imageUrl = parkHistory[pIndex].imageUrl
    park.imageAlt = parkHistory[pIndex].imageAlt
    park.descript = parkHistory[pIndex].descript
    park.fee = parkHistory[pIndex].fee
    park.hours = parkHistory[pIndex].hours
    park.weather = parkHistory[pIndex].weather
    park.lat = parkHistory[pIndex].lat
    park.lon = parkHistory[pIndex].lon

    if(park.imageUrl) {
        var pImg = document.createElement("img")
        pImg.setAttribute("src", park.imageUrl)
        pImg.setAttribute("alt", park.imgAlt)
        pImg.classList.add("responsive-img")
        parkImg.appendChild(pImg)
    }
    var facts = document.createElement("p")
    facts.textContent = park.descript
    parkFacts.appendChild(facts)
    fetchForecast(latidue, longitude)

    // displayInfo(park.descript, park.fee, park.hours, park.weather)
}

// var displayCampground = function () {
//     if (campground) {
//         for(i=0; i < campground.name.length; i++) {
//             var campgroundListItem = document.createElement("li");
//             if(campground.url[i]) {
//                 campgroundLink = document.createElement("a");
//                 campgroundLink.textContent = campground.name[i];
//                 campgroundLink.setAttribute("href", campground.url[i]);
//                 campgroundLink.setAttribute("target", "_blank");
//                 campgroundLink.id="campground-link";
//                 campgroundListItem.appendChild(campgroundLink);
//             } else {
//                 campgroundListItem.textContent = campgrounds.name[i];
//             }
//             console.log("campground in displayCampground", campground);
//             campgroundListEl.appendChild(campgroundListItem);
//         }
//         } else {
//             var campgroundListItem = document.createElement("li")
//             campgroundListItem.textContent = "No campground information found"
//             campgroundListEl.appendChild(campgroundListItem);
//         }
//     };
// // fetch function
// var fetchCampground = function(parkCode) {
//     var apiCampground = "https://developer.nps.gov/api/v1/campgrounds?parkCode=" + parkCode + "&api_key=BDfajyEhltU1a2tl5CuDG7MpyjVByr4sITJOfWP0";
//     fetch(apiCampground).then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         console.log("campgrounds", data.data);
//         campground.name[0] = "No campground information found";
//         if(data.data) {
//             for (i=0; i < data.data.length; i++) {
//                 campground.name[i] = data.data[i].name;
//                 console.log("campground url", data.data[i].url);
//                 if(data.data[i].url) {
//                     campgrounds.url[i] = data.data[i].url;
//                 }
//             }
//         }
//         displayCampground();
//     })
//     .catch(function(error) {
//         console.error(error);
//         campground.name[0] = "No campground information found";
//         displayCampground();
//     });
// };

// // visitor center info
// // array
// var visitorCenter = {
//     name: "",
//     description: "",
//     imageUrl: "",
//     imageAlt: "",
// };
// // display function
// var displayVisitorCenter = function() {
//     if(visitorCenter) {
//         visitorCenterErrorEl.style.display = "none";
//         console.log('visitor center object: ${visitorCenter');
//         var visitorCenterName = document.createElement("h4");
//         visitorCenterName.textContent = visitorCenter.name;
//         visitorCenterName.id = "visitor-center-name";
//         var visitorCenterInfo = document.createElement("p");
//         visitorCenterInfo.textContent = visitorCenter.description;
//         visitorCenterInfo.id = "visitor-center-info";
//         var visitorCenterImage = document.createElement("img");
//         visitorCenterImage.id = "visitor-center-image";
//         visitorCenterImage.setAttribute("src", visitorCenter.imageUrl);
//         visitorCenterImage.setAttribute("height", "300px");
//         visitorCenterImage.setAttribute("alt", visitorCenter.imageAlt);

//         visitorCenterEl.append(visitorCenterName, visitorCenterInfo, visitorCenterImage);
//     } else {
//         visitorCenterErrorEl.style.display = "block";
//         console.log("No visitor center information found");
//     }
// };

// // fetch function
// var fetchVisitorCenter = function(parkCode) {
//     var apiVisitorCenter = "https://developer.nps.gov/api/v1/visitorcenters?q=" + parkCode + "&api_key=BDfajyEhltU1a2tl5CuDG7MpyjVByr4sITJOfWP0";
//     fetch(apiVisitorCenter).then(function (response) {
//         return response.json();
//     })
//     .then(function(data) {
//         console.log("fetchVisitorCenter data", data.data);
//         if(data.data[0]) {
//             visitorCenter.name = data.data[0].name;
//             visitorCenter.description = data.data[0].description;

//             if(data.data[0].images[0]) {
//                 visitorCenter.imageUrl = data.data[0].images[0].url;
//                 visitorCenter.imageAlt = data.data[0].image[0].altText;
//             }
//             displayVisitorCenter();
//         }
//     })
//     .catch(function(error) {
//         console.error(error);
//         visitorCenterErrorEl.style.display = "block";
//         console.log("API Catch- visitor center fetch failed");
//     });
// };

// // forecast info
var latitude = park.lat
var longitude = park.lon

var parkForecast = {
    forecastDate: [],
    forecastTemp: []
};
// display function 

// fetch funciton 
var fetchForecast = function (latitude, longitude) {
    var apiUrlForecast = "https://api.open-meteo.com/v1/forecast?" + latitude + longitude + "daily=weathercode,temperature_2m_max,precipitation_probability_max,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago"
    fetch(apiUrlForecast).then(function (response){
        return response.json();
    })
    .then(function (data) {
        initializeParkForecast();
        if (data) {
            for (i=0; i<5, i++;) {
                parkForecast.forecastDate.push(moment.unix(data.daily[i].dt).utcOffset(data.timezone / 3600).format("MMM Do, YYYY"));
                parkForecast.forecastTemp.push(data.daily[i].temp.day.toFixed(1));
            }
        }
    })
    .catch(function (error) {
        console.error(error);
        console.log("Hello from weather");
    });
};

getCurrent()
