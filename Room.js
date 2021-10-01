export class RoomSystem {
    constructor() {
	    this.rooms = {}
  	}

    generate_data(meta,sender_node_name,room_name){
        
        switch (meta) {
            case "list of user":
                return JSON.stringify({
                    "meta"		          : "list of user",
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
            console.log()
            
            return 1
        }
        return 0
    }
      
    join_room(uuid,room_name,username,socket){
        // set username
        socket["username"] = username
        // Join room if user haven't join
        if(!this.rooms[room_name][uuid]){
            this.rooms[room_name][uuid] = socket
            return 1
        }
        return 0
    }
      
    list_of_room(){
        for (const [key, value] of Object.entries(this.rooms)) {
            console.log(`${key}: ${value}`);
        }
    }
      
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
    
}