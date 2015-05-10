var iotkit = require('iotkit-comm');
var path = require('path');
var mqtt = require('mqtt');

var MQTT_ADDRESS = 'tcp://iot.eclipse.org';
var mqttClient  = mqtt.connect(MQTT_ADDRESS);
var MQTT_ACTUATOR_CONFIG_CHANNEL = "/senzoriada/devtalksdemo/actuator/config";
var MQTT_SENSOR_PUBLISH_CHANNEL = "/senzoriada/devtalksdemo/sensors";
var MQTT_ACTUATOR_PUBLISH_CHANNEL = "/senzoriada/devtalksdemo/actuators/state"

var sensorNodes = {};

var actuators = {
    add: function(k, v) {
        this[k] = v; 
    }
};

var actuatorSpecs = {
    add: function(k, v) {
        this[k] = v; 
    }
};

mqttClient.on('connect', function () {
  console.log("Connected to:"+ MQTT_ADDRESS);
  mqttClient.subscribe(MQTT_ACTUATOR_PUBLISH_CHANNEL);
});

mqttClient.on('message', function (topic, message) {
  var command = JSON.parse(message.toString());
  updateActuator(command);
});



var query = new iotkit.ServiceQuery(path.join(__dirname, "sensor-node-query.json"));
iotkit.createClient(query, function (sensorNode) {
  sensorNode.comm.setReceivedMessageHandler(function (message, context) {
    sensorNodes[sensorNode.spec.name] = JSON.parse(message);
    mqttClient.publish(MQTT_SENSOR_PUBLISH_CHANNEL, JSON.stringify(getSensorNodesPayload()), {qos:2, retain:true});
  });
});

var query = new iotkit.ServiceQuery(path.join(__dirname, "actuator-query.json"));
iotkit.createClient(query, function (actuator) {
  actuators.add(actuator.spec.name, actuator);
  actuatorSpecs.add(actuator.spec.name, actuator.spec.properties);

  mqttClient.publish(MQTT_ACTUATOR_CONFIG_CHANNEL, JSON.stringify(actuatorSpecs),{qos:2, retain:true});
  actuator.comm.setReceivedMessageHandler(function (message, context) {
    console.log("received from actuator: " + message.toString());
  });
  actuator.comm.send(JSON.stringify({"state":"off"}));
});

var updateActuator = function(command) {
    var actuatorName = Object.keys(command)[0];
    var actuator = actuators[actuatorName];
    if (actuator !== undefined) {
        actuator.comm.send(JSON.stringify({"state":command[actuatorName]}));
    }
}

var getSensorNodesPayload = function() {
    var sensorNodesArray = [];
    var keys = Object.keys(sensorNodes);
    var index;
    for (index = 0; index < keys.length; index++) {
	sensorNodesArray.push(sensorNodes[keys[index]]);
    }
    return {"sensorNodes":sensorNodesArray};
}


