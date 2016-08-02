var telldus = require('telldus');
var CronJob = require('cron').CronJob;
var SunCalc = require('suncalc');
require('date-utils');
require('scribe-js')();

var console = process.console;

console.time().info('--- Start new scheduling at ' + new Date() + "---");

// get today's sunlight times for Karlskrona
var times = SunCalc.getTimes(Date.today().add({ "hours" : 3 }), 56.1612, 15.5869);
console.time().info('sunrise: ' + times.sunrise);
console.time().info('sunset: ' + times.sunsetStart);

var minutesOffset = 0;

// id = 1, name = "Vardagsrum lampa norr"
scheduleAndExcecute(newDate(6, 15), sunriseOrMinimum(newDate(7, 30)), 1);
scheduleAndExcecute(sunsetOrMaximum(newDate(20, 0)), newDate(23, 30), 1);

//id = 2, name = "Utomhus lampa soder"
scheduleAndExcecute(newDate(5, 30), sunriseOrMinimum(newDate(7, 30)), 2);
scheduleAndExcecute(sunsetOrMaximum(newDate(20, 0)), newDate(23, 00), 2);

//id = 3, name = "Kok lampa norr"
scheduleAndExcecute(newDate(6, 0), sunriseOrMinimum(newDate(7, 30)), 3);
scheduleAndExcecute(sunsetOrMaximum(newDate(20, 0)), newDate(23, 00), 3);

console.time().info('Finished scheduling for lights');

function scheduleAndExcecute(startDate, endDate, id) {
  console.time().info('About to schedule ' + id);

  new CronJob(createCron(startDate), function() {
    turnOn(id);
  }, null, true, null);

  new CronJob(createCron(endDate), function() {
    turnOff(id);
  }, null, true, null);

  if(new Date().between(startDate, endDate)) {
    console.time().info('Light should be on (raspberry where restarted??) ' + id);
    turnOn(id);
  }
}

function createCron(date) {
  var str =  date.getSeconds() + ' ' + date.add({"minutes" : minutesOffset}).getMinutes() + ' ' + date.getHours() + ' * * *';
  minutesOffset = minutesOffset + 1;
  console.time().info('Cron: ' + str);
  return str;
};

function turnOn(id) {
  console.time().info('Try to turn on ' + id);
  telldus.turnOn(id, function(err) {
    console.time().info(id + ' is now on');
  });
}

function turnOff(id) {
  console.time().info('Try to turn off ' + id);
  telldus.turnOff(id, function(err) {
    console.time().info(id + ' is now off');
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
  //console.time().info(date);
  return date;
}

function wait () {
  setTimeout(wait, 10000);
};

wait();
