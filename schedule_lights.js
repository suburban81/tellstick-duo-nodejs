console.log('Create schedule for lights');

var telldus = require('telldus');
var CronJob = require('cron').CronJob;
var SunCalc = require('suncalc');

// get today's sunlight times for Karlskrona
var times = SunCalc.getTimes(new Date(), 56.1612, 15.5869);

var sunriseStr = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
var sunsetStr = times.sunsetStart.getHours() + ':' + times.sunsetStart.getMinutes();

console.log('Sunrise: ' + sunriseStr);
console.log('Sunset: ' + sunsetStr);

new CronJob('1 * * * * *', function() {
  console.log('You will see this message every minute');
}, null, true, null);

telldus.turnOn(1 ,function(err) {
  console.log('1 is now ON');
});

var listener = telldus.addRawDeviceEventListener(function(controllerId, data) {
  console.log('Raw device event: ' + data);
});

console.log('Finished scheduling for lights');

function wait () {
        setTimeout(wait, 10000);
};

wait();
