export class RoomSystem {
    
    constructor() {
	    this.rooms = {}
        this.user_room = {}
  	}

    generate_data(meta,sender_node_name,room_name){
        
        switch (meta) {
            case "list of user":
                return JSON.stringify({
                    "meta"		        : "list of user",
                    "sender_node_name"  : sender_node_name,
                    "message" 	        : this.list_user_in_a_room(room_name),
                    "room_name"         : room_name,
                  })
                break
        
            default:
                return JSON.stringify({
                    "meta"		      : meta,
                    "sender_node_name": sender_node_name,
                    "message" 	      : "",
                    "room_name"       : room_name,
                  })
                break
        }
        
        
    }

    create_room(room_name){
        // Create room if room name not exist
        if(!this.rooms[room_name]){
            this.rooms[room_name] = {}
            
            return 1
        }
        return 0
    }
      
    join_room(uuid,room_name,username,socket){
        // set username
        socket["username"] = username

        // Check if the room is exist
        if( this.rooms[room_name] ) {
            // Join room if user haven't join
            if(!this.rooms[room_name][uuid]){
                this.rooms[room_name][uuid] = socket
                
                this.user_room[uuid] = room_name
    
                // Debug : Print User and their room name
                console.log("User and Room Dict ",this.user_room)
                console.log()
                
                return 1
            }
        }

        return 0
    }
    
    // Only Debugging purpose
    list_of_room(){
        for (const [key, value] of Object.entries(this.rooms)) {
            console.log(`${key}: ${value}`);
        }
    }
      
    // Return array of users
    list_user_in_a_room(room_name){
        var users = []
        if( this.rooms[room_name] ){
          for (const [key, value] of Object.entries(this.rooms[room_name])) {
            users.push(value["username"])
          }
        }
        
        return users 
    }
      
    broadcast_to_all_user_in_the_room(data,room_name){
        for (const [key, value] of Object.entries(this.rooms[room_name])) {
          value.send(data)
        }
    }

    leave(room,uuid){
        // not present: do nothing
        if(! this.rooms[room][uuid]) return
    
        // if the one exiting is the last one, destroy the room
        if(Object.keys(this.rooms[room]).length === 1) delete this.rooms[room]
        // otherwise simply leave the room
        else delete this.rooms[room][uuid]
    }

    user_disconnected(uuid){
        // Update rooms : Menghapus uuid dari tiap room di rooms
        Object.keys(this.rooms).forEach(room => this.leave(room,uuid))

        if( this.rooms[this.user_room[uuid]] ){
            // broadcast list user terbaru
            let temp = this.generate_data("list of user","Room",this.user_room[uuid])
            this.broadcast_to_all_user_in_the_room(temp,this.user_room[uuid])
        }
        
        // delete later
        console.log(this.list_user_in_a_room(this.user_room[uuid]))

        // delete user_room data for the uuid
        delete this.user_room[uuid]
    } 
    
}