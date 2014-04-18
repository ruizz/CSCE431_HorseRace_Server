var io;
var socket;
var games = {};

var globalVar = 0;

exports.init = function(sio, client_socket){
    console.log('horserace.js - initGame Called');
    io = sio;
    socket = client_socket;
    socket.emit('connected', { message: "You are connected!" });

    // Host Events
    // TODO: Timer, round func
    socket.on('createNewGame', createNewGame);
    socket.on('joinGame', joinGame);

    // Player Events
    // TODO:
};

function createNewGame(data) {
    var gameName = data.gameName;
    var userID = data.userID;
    // TODO: Generating unique Game ID...
    if(gameName in games) { // gameName already exist
        socket.emit('showError', 'the same game name already exist..');
    } else {
        var game = new Game(gameName);
        games[gameName] = game;

        // console.log(games[gameName].players);
        if ( !(userID in (games[gameName].players) )) {
            games[gameName].players[userID] = socket.id; // User Identifier

            // For debug
            console.log('   User ID:' + userID);
            console.log('   Socket ID:' + socket.id);
            console.log('   Game Name: ' + gameName);
            console.log('   Players:' + Object.keys(games[gameName].players));
            console.log('   Num Games:' + Object.keys(games).length);

            socket.emit('newGameCreated', {
                gameName: gameName,
                players: Object.keys(games[gameName].players)
                // players: Object.keys(games[gameName].players)
            });

            this.emit('updateGameList', Object.keys(games));
        } else {
            socket.emit('showError', 'User already joined the game');
        }
    }
}

function joinGame(data){
    var gameName = data.gameName;
    var userID = data.userID;

    console.log("joinGame - horserace.js");
    // console.log("   Game name: " + gameName);
    // console.log("   Player: " + userID);

    if (gameName in games)  {
        if ( !(userID in (games[gameName].players) )) {
            games[gameName].players[userID] = socket.id;

            socket.emit('gameJoined', {
                gameName: gameName,
                players: Object.keys(games[gameName].players)
            });

            // console.log(Object.keys(games[gameName].players));
            // TODO: notify other users that this user joined the game.
            for (uid in games[gameName].players ) {
                console.log(uid);
                console.log(games[gameName].players[uid]);
                socket.socket(games[gameName].players[uid]).emit('updateUserList', Object.keys(games[gameName].players));
            }
            
        } else {
            socket.emit('showError', 'User already joined the game');
        }

    } else {
        socket.emit('showError', 'Game does not exist');
    }
}

function Game(gName) {
    this.gameName = gName;
    this.round = 0;
    this.timer = 0;
    this.started = false;
    this.players = {};
    this.moves = generateMoves();

}

// How can I create a two dimensional array in JavaScript?
// http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
// Usage: createArray(8, 10);
// Game.prototype.createArray = function createArray(length) {
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
}

// START GAME BOARD GENERATION CODE
// generate moves function returns an 8x10 2D array with all the moves for the horses
function generateMoves() {
    var _ = require('underscore');

    // Generate the first second and third place horses
    var shuffle = shuffleArray(_.range(8));
    var first = shuffle[0];
    var second = shuffle[1];
    var third = shuffle[2];

    var firstPlaceMoves = createPlaceMoves(1);
    var secondPlaceMoves = createPlaceMoves(2);
    var thirdPlaceMoves = createPlaceMoves(3);

    // Create moves array
    var moves = Array()
    for (i in _.range(8)) {
        moves.push(createNonPlaceMoves(3))
    }

    // Swap in winning horse moves
    moves[first] = firstPlaceMoves;
    moves[second] = secondPlaceMoves;
    moves[third] = thirdPlaceMoves;

    // console.log(moves);
    return moves;
}

// Create round move arrays for place positions 1st, 2nd, 3rd
function createPlaceMoves(place) {
    var placeOffset = 7+place;
    var moves = Array.apply(null, new Array(placeOffset)).map(Number.prototype.valueOf,0);
    while (arraySum(moves) != 20) {
        for (i in moves) {
            moves[i] = Math.floor((Math.random()*4));
        }
        // I can add more rules here
        // i.e. at least 2 zero move rounds
    }
    while(moves.length != 10) {
        moves.push(0);
    }
    return moves;
}

// Create round move array for the rest, should not be at end on 10th round
function createNonPlaceMoves(place) {
    var moves = Array.apply(null, new Array(10)).map(Number.prototype.valueOf,0);
    while (arraySum(moves) != 19) {
        for (i in moves) {
            moves[i] = Math.floor((Math.random()*4));
        }
    }
    return moves;
}

// Returns the sum of values in the array
function arraySum(arr) {
    var total = 0;
    for (i in arr) {
        total += arr[i]
    }
    return total;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// END GAME BOARD GENERATION CODE


// TODO: Routing - Lobby, Game
// app.get('/', function (req, res) {
//   res.sendfile(__dirname + '/public/game.html');
// });

// // For testing
// // TODO: Use cookie or another unique identification value
// var usernames = {};
// var  user_count = 0;

// // This code will be excuted when a client attempts to connect to the server.
// io.sockets.on('connection', function (socket) {
//  // Add user information
//  socket.on('join', function(data) {
//      var username = data.username;
//      users[user_count] = {};
//      users[user_count].name = username;
//      // send client a list of users.
//      io.socket.emit('update_users', users);
//      user_count++;
//  });

//  // Start game
//  // TODO: Check condition (# of plyayers 8~10)
//  socket.broadcast.emit('game_started', data);

//  // Game over
//  // TODO: Check condition
//  socket.broadcast.emit('game_over', data)

//  // Passing actions
//  // TODO: Betting, unBetting, etc.
//  // Disconnect

//  socket.on('disconnect', function () {
//         delete users[socket.username];
//         io.sockets.emit('update_users', users);
//         user_count--;
//     });
// });

// Chat server tutorial code
// io.sockets.on('connection', function (socket) {
//  // when the client emits 'adduser', this listens and executes
//  socket.on('adduser', function(username){
//      // store the username in the socket session for this client
//      socket.username = username;
//      // store the room name in the socket session for this client
//      // socket.room = 'room1';
//      // add the client's username to the global list
//      usernames[username] = username;
//      // send client to room 1
//      // socket.join('room1');
//      // echo to client they've connected
//      // socket.emit('updatechat', 'SERVER', username + ' has connected to room1');
//      // echo to room 1 that a person has connected to their room
//      // socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
//      socket.emit('updaterooms', rooms, 0);
//  });

//  socket.on('createRoom', function(roomname) {
//      socket.roomname = roomname;
//      rooms.push(roomname);
//      socket.emit('updaterooms', rooms, roomname);
//  });

//  // when the client emits 'sendchat', this listens and executes
//  socket.on('sendchat', function (data) {
//      // we tell the client to execute 'updatechat' with 2 parameters
//      io.sockets.in(socket.room).emit('updatechat', socket.username, data);
//  });

//  socket.on('switchRoom', function(newroom){
//      socket.leave(socket.room);
//      socket.join(newroom);
//      socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
//      // sent message to OLD room
//      socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
//      // update socket session room title
//      socket.room = newroom;
//      socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
//      socket.emit('updaterooms', rooms, newroom);
//  });


//  // when the user disconnects.. perform this
//  socket.on('disconnect', function(){
//      // remove the username from global usernames list
//      delete usernames[socket.username];
//      // update list of users in chat, client-side
//      io.sockets.emit('updateusers', usernames);
//      // echo globally that this client has left
//      socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
//      socket.leave(socket.room);
//  });
// });