var socketio = require('socket.io');
var roomQueries = require('../query-service/room-queries');
var userQueries = require('../query-service/user-queries');
var onlineUsers = [];
module.exports.listen = function(server){
    var io = socketio.listen(server)

    io.on('connection', function(socket){
	  	console.log("we have a connection from", socket.handshake.query.user);

	  	userQueries.getUserById(socket.handshake.query.user, function(userData){
	  		if(userData){
	  			var userData = {id: userData[0].id, name: userData[0].name};
	  			console.log(userData);
	  			onlineUsers.push(userData);
	  			io.emit("user online noti", userData);
	  		}
	  	})

	  	socket.rooms = [];

	  	//query db to see which rooms that the user is in
	  	socket.on("rejoin rooms", function(data, callback){
	  		roomQueries.getJoinedRooms(data.user.id, function(rows){
	  			if(rows.length){
	  				if(rows.length != 0){
	  					socket.rooms = rows;
	  					for(var i=0; i< rows.length; i++){
	  						socket.join(rows[i].id);
	  					}
	  					callback(socket.rooms, "Re-join rooms sucessfully");
	  				}else{
	  					callback(false, "Want to join a room?");
	  				}
	  			}else{
	  				callback(false, "Connection error");
	  			}
	  		})
	  	})

	  	socket.on("update online users", function(callback){
	  		callback(onlineUsers);
	  	})
	  	

	  	socket.on("join room", function(data, callback){		
	  		socket.join(data.room);
	  		var msg = 'user ' + data.user.name + ' joins ' + data.room;
	    	callback(true, msg);
	  	});

	  	

	  	socket.on('new room message', function(data){
	  		console.log('new room msg');
	  		data.senderName = onlineUsers.filter(function(onlinerUser){
	  			return onlinerUser.id == data.sender;
	  		})[0].name;

	  		data.roomName = socket.rooms.filter(function(room){
	  			return room.id == data.roomId;
	  		})[0].name;

	  		io.to(data.roomId).emit('receive room message',data);
	  	})

	  	socket.on('disconnect', function(){
	  		console.log(socket.handshake.query.user + ' has disconnected!');
	  		for(var i=0; i<onlineUsers.length; i++)
	  		{
	  			if(onlineUsers[i].id == socket.handshake.query.user){
	  				onlineUsers.splice(i,1);
	  			}
	  		}
	  		io.emit('user offline noti', socket.handshake.query.user);
	  	})
	  
	});

	

    return io;
}