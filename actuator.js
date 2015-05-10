var iotkit = require('iotkit-comm');
var path = require('path');
var grove = require('jsupm_grove');

var led = new grove.GroveLed(5);

var name = process.argv[2];
if (name == undefined){
    name = "led-out";
}

var updateTime = process.argv[3];
if (updateTime == undefined) {
    updateTime = 5000;
}

console.log("using:"+name+ " updateTime:"+ updateTime);

var spec = new iotkit.ServiceSpec({"name":"/senzoriada/"+name+"/actuator", "type":{"name":"zmqreqrep"}, "properties":{"actuator_type":"ON_OFF","description":"The test LED"}});

iotkit.createService(spec, function (service) {
  service.comm.setReceivedMessageHandler(function(msg, context, client) {
    var command = JSON.parse(msg.toString());
    var value = command["state"];
    if (value == 1) {
	led.on();
    }
    else {
	led.off();
    }
    service.comm.send("hi "+ name);
  });
});

