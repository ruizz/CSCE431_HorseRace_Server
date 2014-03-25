// Call necessary files - Just like #include in C++
var express = require('express'),
	app = express(),
  	http = require('http'),
  	socketio = require('socket.io')
  	path = require('path'),
  	game = require('./game');

// Default path configuration
app.configure(function() {
	app.use(express.static(path.join(__dirname,'public')));
});

// Create server	
var server = http.createServer(app).listen(8080);
var io = socketio.listen(server);

// To not show trivial logs such as keepalives
io.set('log level' ,1);

io.sockets.on('connection', function (socket) {
	console.log('server.js - io.sockets.on(), client connected');
	game.initGame(io, socket);
});

// TODO: Routing - Lobby, Game
// app.get('/', function (req, res) {
//   res.sendfile(__dirname + '/public/game.html');
// });

// // For testing
// // TODO: Use cookie or another unique identification value
// var usernames = {};
// var	user_count = 0;

// // This code will be excuted when a client attempts to connect to the server.
// io.sockets.on('connection', function (socket) {
// 	// Add user information
// 	socket.on('join', function(data) {
// 		var username = data.username;
// 		users[user_count] = {};
// 		users[user_count].name = username;
// 		// send client a list of users.
// 		io.socket.emit('update_users', users); 
// 		user_count++;
// 	});

// 	// Start game
// 	// TODO: Check condition (# of plyayers 8~10)
// 	socket.broadcast.emit('game_started', data);

// 	// Game over
// 	// TODO: Check condition
// 	socket.broadcast.emit('game_over', data)

// 	// Passing actions
// 	// TODO: Betting, unBetting, etc.
// 	// Disconnect

// 	socket.on('disconnect', function () {
//         delete users[socket.username];
//         io.sockets.emit('update_users', users);
//         user_count--;
//     });
// });

// Chat server tutorial code
// io.sockets.on('connection', function (socket) {
// 	// when the client emits 'adduser', this listens and executes
// 	socket.on('adduser', function(username){
// 		// store the username in the socket session for this client
// 		socket.username = username;
// 		// store the room name in the socket session for this client
// 		// socket.room = 'room1';
// 		// add the client's username to the global list
// 		usernames[username] = username;
// 		// send client to room 1
// 		// socket.join('room1');
// 		// echo to client they've connected
// 		// socket.emit('updatechat', 'SERVER', username + ' has connected to room1');
// 		// echo to room 1 that a person has connected to their room
// 		// socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
// 		socket.emit('updaterooms', rooms, 0);
// 	});
	
// 	socket.on('createRoom', function(roomname) {
// 		socket.roomname = roomname;
// 		rooms.push(roomname);
// 		socket.emit('updaterooms', rooms, roomname);
// 	});

// 	// when the client emits 'sendchat', this listens and executes
// 	socket.on('sendchat', function (data) {
// 		// we tell the client to execute 'updatechat' with 2 parameters
// 		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
// 	});
	
// 	socket.on('switchRoom', function(newroom){
// 		socket.leave(socket.room);
// 		socket.join(newroom);
// 		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
// 		// sent message to OLD room
// 		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
// 		// update socket session room title
// 		socket.room = newroom;
// 		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
// 		socket.emit('updaterooms', rooms, newroom);
// 	});
	

// 	// when the user disconnects.. perform this
// 	socket.on('disconnect', function(){
// 		// remove the username from global usernames list
// 		delete usernames[socket.username];
// 		// update list of users in chat, client-side
// 		io.sockets.emit('updateusers', usernames);
// 		// echo globally that this client has left
// 		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
// 		socket.leave(socket.room);
// 	});
// });
