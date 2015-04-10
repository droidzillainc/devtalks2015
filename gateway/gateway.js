

var MQTT_ADDRESS = 'tcp://iot.eclipse.org';
var mqtt    = require('mqtt');
var client  = mqtt.connect(MQTT_ADDRESS);
 
client.on('connect', function () {
  console.log("Connected to:"+ MQTT_ADDRESS);
  client.subscribe('presence');
  client.publish('rubix/test', 'Hello mqtt 2');
});
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log("Aici");
  console.log(message.toString());
  
});


var iotkit = require('iotkit-comm');
var path = require('path');
var spec = new iotkit.ServiceSpec(path.join(__dirname, "server-spec.json"));
iotkit.createService(spec, function (service) {
  service.comm.setReceivedMessageHandler(function(msg, context, client) {
    console.log("received from client: " + msg.toString());
//    service.comm.send("hi");
  });
});


