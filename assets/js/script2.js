// JavaScript for Park Page
var today = dayjs();

var dayWeek = today.format('ddd');
$('#today').text(dayWeek);

// var tomorrow = today.add(1);
// tomorrow.format('ddd')
// $('#tomorrow').text(tomorrow);

var tomorrow = today.add(1, 'days');
var reformTomorrow = 
$('#tomorrow').text(tomorrow);

var twodays = today.add(2, 'days');
$('#2days').text(twodays);

// 3. Parse the following date, 11/3/2020, and convert it into the following format: Sunday, February 14 2010, 3:25:50 pm.
var reformatDate = dayjs('2020-11-03').format('dddd, MMMM D YYYY, h:mm:ss a');
$('#3a').text(reformatDate);