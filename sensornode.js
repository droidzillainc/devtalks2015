var iotkit = require('iotkit-comm');
var path = require('path');
//var index = 0;

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
    console.log("Sending data");
    var sensorData = {
			"id":name,
			"voltage":4500,
			"timestamp":(new Date()).getTime(),
			"sensors":[
			    {
				"type":10,
				"version":1,
				"value":2376
			    }
			]};
    service.comm.send(JSON.stringify(sensorData));
//    console.log("Data send."+ index);
  }, updateTime);
});



