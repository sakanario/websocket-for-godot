
import { RoomSystem }  from './Room.js'
import { WebSocketServer }  from 'ws';

let room = new RoomSystem()

const PORT = process.env.PORT || 3000

var wss = new WebSocketServer({ port: PORT }); 
console.log("Server started on port",PORT)

let counter = 0

wss.on('connection',(socket) => {
	const uuid = counter
  
  console.log(`${uuid} is connected.`)
	counter += 1

	socket.on('message', raw_data => {
    var data = JSON.parse(raw_data)
	  const { meta, sender_node_name, message, room_name } = data;
    
    // Debugging : Print received data
    console.log("Data received : ",data)
    console.log()
    
    switch (meta) {
      case "create_room":
        if(room.create_room(room_name)){ // Host Create Room
          if(room.join_room(uuid,room_name,message,socket)){ //Host join the room
            
            // set user room
            // user.set_room_name(room_name)

            // Send success create and join room
            socket.send( room.generate_data("success create room",sender_node_name,room_name) )
          }
        }
        break

      case "join_room":
        if( room.join_room(uuid,room_name,message,socket) ){ // Member Join the room
          // Send succes join room
          socket.send(room.generate_data("success join room",sender_node_name,room_name))
        }
        break
      
      case "list of user":
        // socket.send( room.generate_data("list of user",sender_node_name,room_name) )
        
        // Send list of user to member
        let temp = room.generate_data("list of user",sender_node_name,room_name)
        room.broadcast_to_all_user_in_the_room( temp,room_name )
        
        // Debugging : List of user in a room
        console.log(`List of user in a room ${room_name} `,room.list_user_in_a_room(room_name))
        console.log()
        
      default:
        break
    }

	})

  socket.on("close", () => {
    // for each room, remove the closed socket
    console.log(`${uuid} is disconnected.`)
    room.user_disconnected(uuid)
  });

})












