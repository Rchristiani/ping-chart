var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var spawn = require('child_process').spawn;
var socketio = require('socket.io');
var io = socketio(server);

app.use(express.static('./'));

io.on('connection', function(socket) {
	var ping;
	socket.on('start', function() {
		ping = spawn('ping', ['www.google.com'], {
			stdio: [
				//setup stream
				0, // use parents stdin for child
				'pipe' // pipe child's stdout to parent
			]
		});

		ping.stdout.on('data', function(data) {	
			//Need to use sockets
			data = data.toString().split(' ');
			//Just quickly grab the time
			io.emit('ping', {time: data[data.length - 2]});
		});
	});

	socket.on('end', function() {
		console.log('Killing process');
		ping.kill();
	});
});
server.listen(3000);
console.log('Server Listening on port 3000');