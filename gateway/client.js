var iotkit = require('iotkit-comm');
var path = require('path');

var clients = {
    length: 0,
    add: function(k, v) {
	if (typeof this[k] === 'undefined') {
	    this.length++;
	}
	this[k] = v;
    }
};



var query = new iotkit.ServiceQuery(path.join(__dirname, "server-query.json"));
iotkit.createClient(query, function (client) {
  clients.add(client.spec.name, client);
//  console.log("client:", client.spec.name);
//  console.log(clients[client.spec.name].comm);
  client.comm.setReceivedMessageHandler(function (message, context) {
    console.log("received from server: " + message.toString());
//    client.comm.send("hello");
  });
  client.comm.send("hello");
});

setInterval(function() {
    console.log("clients:"+ clients.length);
    var client = clients['/senzoriada/apa-baie/actuator'];
    if (client !== undefined) {
	console.log("Sending");
	client.comm.send("apa baie on");
    }
    else {
	console.log("Not connected");
    }
}, 10000);
