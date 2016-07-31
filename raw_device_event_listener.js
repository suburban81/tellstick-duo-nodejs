var telldus = require('telldus');

console.log('About to start listener');

var listener = telldus.addRawDeviceEventListener(function(controllerId, data) {
  console.log('Raw device event: ' + data);
});

function wait () {
        setTimeout(wait, 10000);
};

wait();
