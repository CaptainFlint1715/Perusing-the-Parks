// JavaScript for Park Page
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


var today = dayjs();

var dayWeek = today.format('ddd');
$('#today').text(dayWeek);

var tomorrow = today.add(1, 'days');

$('#tomorrow').text(tomorrow.format('ddd'));

var twodays = today.add(2, 'days');
$('#2days').text(twodays.format('ddd'));

var threedays = today.add(3, 'days');
$('#3days').text(threedays.format('ddd'));


