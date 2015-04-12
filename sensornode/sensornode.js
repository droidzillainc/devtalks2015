var iotkit = require('iotkit-comm');
var path = require('path');
var index = 0;


var iotkit = require('iotkit-comm');
var path = require('path');
var spec = new iotkit.ServiceSpec(path.join(__dirname, "server-spec.json"));
iotkit.createService(spec, function (service) {
//  console.log("connected:", service.comm.client);
  //console.log("service.comm", service.comm);
//  service.comm.client.on('connect', function(client) {
//    console.log("onConnect:", client);
//  });
//  service.comm.setReceivedMessageHandler(function(msg, context, client) {
//    console.log("received from gateway: " + msg.toString());
//    service.comm.send("hi");
//  });
  setInterval(function() {
//    console.log("connected:", service.comm.client.queue);
    console.log("Sending data");
    var sensorData = {"temperature":12.43, "battery":3200, "index":index++};
    service.comm.send(JSON.stringify(sensorData));
    console.log("Data send."+ index);
  }, 5000);
  
});




