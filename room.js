var WebSocketServer = require('ws').Server

const PORT = process.env.PORT || 3000

var wss = new WebSocketServer({ port: PORT }); 
console.log("Server started on port",PORT)

const rooms = {};
let counter = 0


wss.on('connection',(socket) => {
	const uuid = counter
  console.log(`${uuid} is connected.`)
	counter += 1
  
  // {{ --- Function Declaration Start --- }}
  const create_room = (room_name) => {
    // Create room if room name not exist
    if(!rooms[room_name]){
      rooms[room_name] = {}
      return 1
    }
    return 0
  }
  
  const join_room = (uuid,room_name,username) => {
    // set username
    socket["username"] = username
    // Join room if user haven't join
    if(!rooms[room_name][uuid]){
      rooms[room_name][uuid] = socket
      return 1
    }
    return 0
  }

  const list_of_room = () => {
    for (const [key, value] of Object.entries(rooms)) {
      console.log(`${key}: ${value}`);
    }
  }

  const list_user_in_a_room = (room_name) => {
    var users = []
    if( rooms[room_name] ){
      for (const [key, value] of Object.entries(rooms[room_name])) {
        users.push(value["username"])
      }
    }
    return users
  }

  const broadcast_to_all_user_in_the_room = (data,room_name) => {
    for (const [key, value] of Object.entries(rooms[room_name])) {
      value.send(data)
    }
  }
  // {{ --- Function Declaration End --- }}

	socket.on('message', raw_data => {
    data = JSON.parse(raw_data)
	  const { meta, sender_node_name,message, room_name } = data;
    console.log(data)
    
    switch (meta) {
      case "create_room":
        if(create_room(room_name)){
          if(join_room(uuid,room_name,message)){
            // Send success message
            socket.send(JSON.stringify({
              "meta"		: "success create room",
              "sender_node_name":sender_node_name,
              "message" 	: `you're in room ${room_name}`,
              "room_name": room_name,
            }))
          }
          // list_of_room()
          // console.log(rooms)
          
          
        }
        break

      case "join_room":
        if( join_room(uuid,room_name,message) ){
          let data_for_attender = JSON.stringify({
            "meta"		: "success join room",
            "sender_node_name":sender_node_name,
            "message" 	: `you're in room ${room_name}`,
            "room_name": room_name,
          })
          socket.send(data_for_attender)
          
          
          // broadcast_to_all_user_in_the_room(data,room_name)
          // socket.send(JSON.stringify({
          //   "meta"		: "success join room",
          //   "sender_node_name":sender_node_name,
          //   "message" 	: `you're in room ${room_name}`,
          //   "room_name": room_name,
          // }))
        }
        
        break
      
      case "list of user":
        socket.send(JSON.stringify({
          "meta"		          : "list of user",
          "sender_node_name"  :sender_node_name,
          "message" 	        : list_user_in_a_room(room_name),
          "room_name"         : room_name,
        }))
        console.log(list_user_in_a_room(room_name))
        
      default:
        break
    }


    // // Create room
    // if(meta === "create_room" ){
    //   if(create_room(room_name)){
    //     join_room(uuid,room_name)
    //   }

    //   console.log(rooms)
      
    // }

    // // Join room
    // if(meta === "join_room"){
    //   join_room(uuid,room_name)
    //   console.log(rooms)
    // }

	})
})


// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    // console.log('IT IS GETTING INSIDE CLIENTS');
    // console.log(client);

    // The data is coming in correctly
    console.log(data);
    client.send(data);
  });
};










