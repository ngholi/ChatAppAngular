var socketio = require('socket.io');

module.exports.listen = function(server){
    var io = socketio.listen(server)

    io.on('connection', function(socket){
	  console.log("we have a connection");
	  socket.on("new-message", function(msg){
	    console.log(msg);
	    io.emit("receive-message", msg);
	  });

	  socket.on("test",function(msg){
	  	console.log("test ok", msg);
	  })

	  
	});

	

    return io;
}