var iotkit = require('iotkit-comm');
var path = require('path');

var name = process.argv[2];
if (name == undefined){
    name = "temperature-in";
}

var updateTime = process.argv[3];
if (updateTime == undefined) {
    updateTime = 5000;
}

console.log("using:"+name+ " updateTime:"+ updateTime);

var spec = new iotkit.ServiceSpec({"name":"/senzoriada/"+name+"/actuator", "type":{"name":"zmqreqrep"}});

iotkit.createService(spec, function (service) {
  service.comm.setReceivedMessageHandler(function(msg, context, client) {
    console.log("received from client: " + msg.toString());
    service.comm.send("hi "+ name);
  });
});

