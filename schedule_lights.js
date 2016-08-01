var telldus = require('telldus');
var CronJob = require('cron').CronJob;
var SunCalc = require('suncalc');
require('date-utils');

console.log('--- Start new scheduling at ' + new Date() + "---");

// get today's sunlight times for Karlskrona
var times = SunCalc.getTimes(Date.today().add({ "hours" : 3 }), 56.1612, 15.5869);
console.log('sunrise: ' + times.sunrise);
console.log('sunset: ' + times.sunsetStart);

var minutesOffset = 0;

//Vardagsrum norr
scheduleAndExcecute(newDate(6, 0), sunriseOrMinimum(newDate(7, 30)), 1);
scheduleAndExcecute(sunsetOrMaximum(newDate(20, 0)), newDate(23, 30), 1);

//Ute söder
scheduleAndExcecute(newDate(5, 0), sunriseOrMinimum(newDate(7, 30)), 2);
scheduleAndExcecute(sunsetOrMaximum(newDate(20, 0)), newDate(23, 00), 2);

console.log('Finished scheduling for lights');

function scheduleAndExcecute(startDate, endDate, id) {
  console.log('About to schedule ' + id);

  new CronJob(createCron(startDate), function() {
    turnOn(id);
  }, null, true, null);

  new CronJob(createCron(endDate), function() {
    turnOff(id);
  }, null, true, null);

  if(new Date().between(startDate, endDate)) {
    console.log('Light should be on (raspberry where restarted??) ' + id);
    turnOn(id);
  }
}

function createCron(date) {
  var str =  date.getSeconds() + ' ' + date.add({"minutes" : minutesOffset}).getMinutes() + ' ' + date.getHours() + ' * * *';
  minutesOffset = minutesOffset + 1;
  console.log('Cron: ' + str);
  return str;
};

function turnOn(id) {
  console.log('Try to turn on ' + id);
  telldus.turnOn(id, function(err) {
    console.log(id + ' is now on');
  });
}

function turnOff(id) {
  console.log('Try to turn off ' + id);
  telldus.turnOff(id, function(err) {
    console.log(id + ' is now off');
  });
}

function sunriseOrMinimum(minDate) {
  return minDate.isAfter(times.sunrise) ? minDate : times.sunrise;
};

function sunsetOrMaximum(maxDate) {
  return maxDate.isBefore(times.sunsetStart) ? maxDate : times.sunsetStart;
};

function newDate(hours, minutes) {
  var date = Date.today().add({ "hours": hours, "minutes": minutes });
  //console.log(date);
  return date;
}

function wait () {
  setTimeout(wait, 10000);
};

wait();
