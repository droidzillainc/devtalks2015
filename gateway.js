var iotkit = require('iotkit-comm');
var path = require('path');
var mqtt    = require('mqtt');

var MQTT_ADDRESS = 'tcp://iot.eclipse.org';
var mqttClient  = mqtt.connect(MQTT_ADDRESS);
 
mqttClient.on('connect', function () {
  console.log("Connected to:"+ MQTT_ADDRESS);
  mqttClient.subscribe('rubix/test/senzoriada-in');
//  mqttClient.publish('rubix/test', 'Hello mqtt 2');
});
 
mqttClient.on('message', function (topic, message) {
  // message is Buffer 
  console.log("Aici", message);
  var command = JSON.parse(message.toString());
  updateActuator(command);
});


var sensorNodes = {};

var query = new iotkit.ServiceQuery(path.join(__dirname, "sensor-node-query.json"));
iotkit.createClient(query, function (sensorNode) {
  sensorNode.comm.setReceivedMessageHandler(function (message, context) {
    sensorNodes[sensorNode.spec.name] = message;
    console.log("received from "+sensorNode.spec.name+" " + message.toString());
    mqttClient.publish("rubix/test/senzoriada", JSON.stringify(getSensorNodesPayload()));
  });
});

var getSensorNodesPayload = function() {
    var sensorNodesArray = [];
    var keys = Object.keys(sensorNodes);
    var index;
    for (index = 0; index < keys.length; index++) {
	sensorNodesArray.push(sensorNodes[keys[index]]);
    }
    return {"sensorNodes":sensorNodesArray};
}


var actuators = {
    length: 0,
    add: function(k, v) {
        if (typeof this[k] === 'undefined') {
            this.length++;
        }
        this[k] = v;
    }
};

var query = new iotkit.ServiceQuery(path.join(__dirname, "actuator-query.json"));
iotkit.createClient(query, function (actuator) {
  actuators.add(actuator.spec.name, actuator);
  actuator.comm.setReceivedMessageHandler(function (message, context) {
    console.log("received from actuator: " + message.toString());
//    client.comm.send("hello");
  });
  actuator.comm.send(JSON.stringify({"state":"off"}));
});

var updateActuator = function(command) {
    var actuatorName = Object.keys(command)[0];
    var actuator = actuators[actuatorName];
    if (actuator !== undefined) {
        console.log("Sending");
        actuator.comm.send(JSON.stringify({"state":command[actuatorName]}));
    }
    else {
        console.log("Not connected");
    }
}

