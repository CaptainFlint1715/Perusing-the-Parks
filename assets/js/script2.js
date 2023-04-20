// JavaScript for Park Page
var today = dayjs();

var dayWeek = today.format('ddd');
$('#today').text(dayWeek);

var tomorrow = today.add(1, 'days');

$('#tomorrow').text(tomorrow.format('ddd'));

var twodays = today.add(2, 'days');
$('#2days').text(twodays.format('ddd'));

var threedays = today.add(3, 'days');
$('#3days').text(threedays.format('ddd'));
