var iotkit = require('iotkit-comm');
var path = require('path');
var index = 0;

var name = process.argv[2];
if (name == undefined){
    name = "temperature-in";
}

var updateTime = process.argv[3];
if (updateTime == undefined) {
    updateTime = 5000;
}

console.log("using:"+name+ " updateTime:"+ updateTime);

var spec = new iotkit.ServiceSpec({"name":"/senzoriada/"+name+"/sensornode", "type":{"name":"mqtt"}});

iotkit.createService(spec, function (service) {
  setInterval(function() {
    console.log("Sending data");
    var sensorData = {"temperature":12.43, "battery":3200, "index":index++};
    service.comm.send(JSON.stringify(sensorData));
    console.log("Data send."+ index);
  }, updateTime);
});




