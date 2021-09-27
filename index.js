var WebSocketServer = require('ws').Server

const PORT = process.env.PORT || 3000

var root_server = new WebSocketServer({ port: PORT }); 
// var server = new wss.Server({port:PORT})

console.log("Server started on port",PORT)



root_server.on('connection',server => {
	// console.log(root_server.clients)
	server.send(JSON.stringify({
		"type"		: "200",
		"message" 	: "Connection is established :D"
	}))

	server.on('message', message => {
		let data = JSON.parse(message)

		if (data.type != null){

			switch(data.type) {
			  case "button":
			    	root_server.broadcast(JSON.stringify({
						"type"		: "button",
						"message" 	: data.value
					}))
			    break;
			  default:
			    console.log("something bad happend")
			}

		}
	})	

	server.on('close',(code,reason) => {
		console.log(code,reason)
	})	


})

// Broadcast to all.
root_server.broadcast = function broadcast(data) {
  root_server.clients.forEach(function each(client) {
    // console.log('IT IS GETTING INSIDE CLIENTS');
    // console.log(client);

    // The data is coming in correctly
    console.log(data);
    client.send(data);
  });
};