// JavaScript for Home Page
var keyNPS = 'BDfajyEhltU1a2tl5CuDG7MpyjVByr4sITJOfWP0'

var statesList = $('states-list')
var stateName = $('state-name')
var parksList = $('parks-list')
var parksPrevious = $('parks-history')
var parkHeader = $('park-header')

var parkCurrent = {
    code: '',
    name: ''
}

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

var history = []

function refresh (id) {
    id.innerHTML = ''
}

function restartClean () {
    history = getHistory()
    displayHistory(history)
    refresh(parksList)
}

function getHistory() {
    var parksStored = localStorage.getItem('history')
    parksStored = json.parse(parksStored)
    if (!parksStored) {
        parksStored = []
    }
    return parksStored
}

function newPark(code) {
    var found = false
    if (history) {
        for (var i = 0; i < history.length; i++) {
            if (history[i].code === parkCurrent.code) {
                found = true
            }
        }
    }
    return found
}

function saveHistory(code, name) {
    newPark(code)

    if (!found) {
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
            if(code === parksOfState.code[i] && (!found)) {
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
        history.push(savePark)
        localStorage.setItem('history', JSON.stringify(history)
        )
    }
}

function displayHistory(history) {
    refresh(parksPrevious)

    if(history) {
        for (var i = 0; i < history.length; i++) {
            var historyListEl = document.createElement('li')
            historyListEl.id = history[i].code
            historyListEl.textContent = history[i].name
            historyListEl.addEventListener('click', function(e) {
                e.preventDefault()
                restartClean()
                saveHistory()
                parkCurrent.code = e.target.id
                parkCurrent.name = e.target.textContent
                localStorage.setItem('parkCurrent', JSON.stringify(parkCurrent))
                window.location.href = './parkpage.html'
            })
            parksPrevious.appendChild(historyListEl)
        }
    }
}

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

function displayParksList() {
    if(parksOfState) {
        for (var i =0; i < parksOfState.name.length; i++) {
            var listPark = document.createElement('li')
            listPark.textContent = parksOfState[i].name
            listPark.id = parksOfState[i].code

            listPark.addEventListener('click', function(e) {
                e.preventDefault()
                // save parks
                
                parkCurrent.code = e.target.id
                parkCurrent.name = e.target.textContent
                saveHistory(parkCurrent.code, parkCurrent.name)
                localStorage.setItem('parkCurrent', JSON.stringify(parkCurrent))
                ocation.href = './parkpage.html'
            })
            parksList.appendChild(listPark)
        }
    }

}

function fetchParks(state) {
    initParks()

    var parksAPI = 'https://developer.nps.gov/api/vi/parks?stateCode=' + state + '&api_key=' + keyNPS

    fetch(parksAPI).then(function(response) {
        return response.json()
    })
    .then(function(data) {
        console.log('NPS api data', data.data)

        parksOfState.state = state
        for (var i = 0; i < data.data.length; i++) {
            parksOfState.code[i] = data.data[i].parkCode
            parksOfState.name[i] = data.data[i].fullName
            if (data.data.images[0]) {
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
displayHistory()

stateName.onchange = function () {
    // clean start
    var stateAbbr = $(this).find('option:selected').attr('id')

    var stateNameCurrent = stateName.value
    parkHeader.textContent = 'National Parks in ' + stateNameCurrent

    fetchParks(stateAbbr)
}