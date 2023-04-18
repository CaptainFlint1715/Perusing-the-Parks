//adding weather api with latitude and longitude variables
var requestUrl = "https://api.open-meteo.com/v1/forecast?" + LAT.var + LONG.var + "hourly=temperature_2m"

var responseText = document.getElementById('response-text');

function getApi(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            console.log(response);
            
            return response.json();
        });
}

getApi(requestUrl);