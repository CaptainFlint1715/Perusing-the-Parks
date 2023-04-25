// JavaScript for Home Page
var keyNPS = 'BDfajyEhltU1a2tl5CuDG7MpyjVByr4sITJOfWP0'

var statesList = document.getElementById('states-list')
var parksList = document.getElementById('parks-list')
var parksPrevious = document.getElementById('parks-history')
var parkHeader = document.getElementById('park-header')

// array designated for current park being processed/selected
var parkCurrent = {
    code: '',
    name: ''
}

// array for the purpose of storing data from nps for parks in selected state
var parksOfState = {
    state: '',
    code: [],
    name: [],
    imageUrl: [],
    imageAlt: [],
    descript: [],
    fee: [],
    hours: [],
    weather: [],
    lat: [],
    lon: [],
}

// checks local storage for park history and initializes if not found
var parkHistory;
try {
  parkHistory = JSON.parse(localStorage.getItem('parkHistory')) || [];
} catch (e) {
  console.log("Error parsing park history from localStorage:", e);
  parkHistory = [];
}

function refresh (id) {
    id.innerHTML = ''
}

function restartClean () {
    parkHistory = getHistory()
    displayHistory(parkHistory)
    refresh(parksList)
}

function getHistory() {
    var parksStored = JSON.parse(localStorage.getItem('parkHistory'))
    if (!Array.isArray(parksStored)) {
        parksStored = []
    }
    return parksStored
}

// checks to see if park selected  already exists in history array
function newPark(code) {
    console.log(code)
    var found = false
    if (parkHistory) {
        for (var i = 0; i < parkHistory.length; i++) {
            if (parkHistory[i].code === parkCurrent.code) {
                found = true
            }
        }
    }
    console.log(found)
    return found
    
}
// saves information about park from api, pushes to history array, and stores array in local storage
function saveHistory(code, name) {

    foundIt = newPark(code)
    

    if (!foundIt) {
        var savePark = {
            state: parksOfState.state,
            name: name,
            code: code,
            imageUrl: '',
            imageAlt: '',
            descript: '',
            fee: '',
            hours: '',
            weather: '',
            lat: '',
            lon: '',
        }
        for ( var i = 0; i < parksOfState.code.length; i ++) {
            if(code === parksOfState.code[i] && (!foundIt)) {
                savePark.imageUrl = parksOfState.imageUrl[i]
                savePark.imageAlt = parksOfState.imageAlt[i]
                savePark.descript = parksOfState.descript[i]
                savePark.fee = parksOfState.fee[i]
                savePark.hours = parksOfState.hours[i]
                savePark.weather = parksOfState.weather[i]
                savePark.lat = parksOfState.lat[i]
                savePark.lon = parksOfState.lon[i]
            }
        }
        parkHistory.push(savePark)
        localStorage.setItem('parkHistory', JSON.stringify(parkHistory))
        
    }
}

// generates list on page of parks user has previously visited on the site
function displayHistory(parkHistory) {
    refresh(parksPrevious)

    if(parkHistory) {
        for (var i = 0; i < parkHistory.length; i++) {
            var historyListEl = document.createElement('li')
            historyListEl.id = parkHistory[i].code
            historyListEl.textContent = parkHistory[i].name
            historyListEl.setAttribute('style', 'color: black')
            historyListEl.style.cursor = 'pointer'
            historyListEl.addEventListener('mouseover', function() {
                this.style.color = 'green';
                });
            historyListEl.addEventListener('mouseout', function() {
                  this.style.color = 'black';
                });
            historyListEl.addEventListener('click', function(e) {
                e.preventDefault()
                parkCurrent.code = e.target.id
                parkCurrent.name = e.target.textContent
                localStorage.setItem('parkCurrent', JSON.stringify(parkCurrent))
                window.location.href = './parkpage.html'
            })
            parksPrevious.appendChild(historyListEl)
        }
    }
}


// generates list on page of the parks found in the state selected
function displayParksList() {
    refresh(parksList)
    if(parksOfState) {
        console.log(parksOfState)
        for (var i = 0; i < parksOfState.code.length; i++) {
            var listPark = document.createElement('li')
            listPark.textContent = parksOfState.name[i]
            listPark.id = parksOfState.code[i]
            listPark.setAttribute('style', 'color: black')
            listPark.style.cursor = 'pointer'
            listPark.addEventListener('mouseover', function() {
                this.style.color = 'green';
                });
            listPark.addEventListener('mouseout', function() {
                  this.style.color = 'black';
                });

            listPark.addEventListener('click', function(e) {
                e.preventDefault()
                // save parks
                
                parkCurrent.code = e.target.id
                parkCurrent.name = e.target.textContent
                console.log(parkCurrent.code)
                saveHistory(parkCurrent.code, parkCurrent.name)
                localStorage.setItem('parkCurrent', JSON.stringify(parkCurrent))
                location.href = './parkpage.html'
            })
            parksList.appendChild(listPark)
        }
    }
}


// initializes array containing info for parks of a given state
function initParks() {
    parksOfState.state = '';
    parksOfState.code.length = 0;
    parksOfState.name.length = 0;
    parksOfState.imageUrl.length = 0;
    parksOfState.imageAlt.length = 0;
    parksOfState.descript.length = 0;
    parksOfState.fee.length = 0;
    parksOfState.hours.length = 0;
    parksOfState.weather.length = 0;
    parksOfState.lat.length = 0;
    parksOfState.lon.length = 0;
}

// calls to National Park Service API for the parks in the state selected and assigns corresponding data on parks to parksOfState array
function fetchParks(state) {
    initParks()
    
    var parksAPI = 'https://developer.nps.gov/api/v1/parks?stateCode=' + state + '&api_key=' + keyNPS

    fetch(parksAPI, {
        headers: {
            'Authorization': keyNPS
        }
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        console.log('NPS api data', data.data)

        parksOfState.state = state
        for (var i = 0; i < data.data.length; i++) {
            parksOfState.code[i] = data.data[i].parkCode
            parksOfState.name[i] = data.data[i].fullName
            if (data.data[i].images[0]) {
                parksOfState.imageUrl[i] = data.data[i].images[0].url
                parksOfState.imageAlt[i] = data.data[i].images[0].altText
            }
            parksOfState.descript[i] = data.data[i].description
            if (data.data[i].entranceFees[0]) {
                parksOfState.fee[i] = data.data[i].entranceFees.cost
            } else {
                parksOfState.fee[i] = 'unavailable'
            }
            parksOfState.hours[i] = data.data[i].operatingHours.standardHours
            parksOfState.weather[i] = data.data[i].weatherInfo
            parksOfState.lat[i] = data.data[i].latitude
            parksOfState.lon[i] = data.data[i].longitude
            
        }
        displayParksList()
    })
    .catch(function(error) {
        console.error(error)
        alert('unable to find parks in state')
    })

}

restartClean()

// generates header for parks list, triggered by selection of state from dropdown
function stateselect() {
    var stateName = document.getElementById('state-name')

    var stateAbbr = (stateName.options[stateName.selectedIndex]).value
    
    var stateNameCurrent = (stateName.options[stateName.selectedIndex]).textContent
    parkHeader.textContent = 'National Parks in ' + stateNameCurrent

    fetchParks(stateAbbr)
}

