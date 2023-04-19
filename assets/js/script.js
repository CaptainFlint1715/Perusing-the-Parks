//adding weather api with latitude and longitude variables
var requestUrl = "https://api.open-meteo.com/v1/forecast?" + LAT.var + LONG.var + "daily=weathercode,temperature_2m_max,precipitation_probability_max,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago"

var responseText = document.getElementById('response-text');

function getApi(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            console.log(response);
            
            return response.json();
        });
}

getApi(requestUrl);
