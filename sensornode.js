var iotkit = require('iotkit-comm');
var path = require('path');
//var index = 0;

var groveSensor = require('jsupm_grove');
var temp = new groveSensor.GroveTemp(0);

var name = process.argv[2];
if (name == undefined){
    name = "temperature-in";
}

name = "/senzoriada/"+name+"/sensornode";

var updateTime = process.argv[3];
if (updateTime == undefined) {
    updateTime = 5000;
}



console.log("using:"+name+ " updateTime:"+ updateTime);

var spec = new iotkit.ServiceSpec({"name":name, "type":{"name":"mqtt"}});

iotkit.createService(spec, function (service) {
  setInterval(function() {
    var celsius = temp.value();
    console.log("Sending data:"+ celsius);
    var sensorData = {
			"id":name,
			"voltage":4500,
			"timestamp":(new Date()).getTime(),
			"sensors":[
			    {
				"type":10,
				"version":1,
				"value":celsius*100
			    }
			]};
    service.comm.send(JSON.stringify(sensorData));
//    console.log("Data send."+ index);
  }, updateTime);
});




