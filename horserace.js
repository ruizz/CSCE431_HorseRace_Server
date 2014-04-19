var io;
var games = {};

exports.init = function(sio, socket){
    console.log('horserace.js - initGame Called');
    io = sio;
    socket.emit('connected', { message: 'You are connected!' });

    // Creating a game
    socket.on('createNewGame', function (data) {
        var gameName = data.gameName;
        var userID = data.userID;

        if(gameName in games) { // gameName already exist
            socket.emit('showError', 'the same game name already exist..');
        } else {
            var game = new Game(gameName);
            games[gameName] = game;

            // console.log(games[gameName].players);
            if ( !(userID in (games[gameName].players) )) {
                games[gameName].players[userID] = socket.id; // User Identifier

                // Join a socket group
                socket.join(gameName);
                
                // Send a client to update its game object
                socket.emit('newGameJoined', {
                    gameName: gameName,
                    players: Object.keys(games[gameName].players)
                    // players: Object.keys(games[gameName].players)
                });

                sendGameList();
                
            } else {
                socket.emit('showError', 'User already joined the game');
            }
        }
    });
    
    socket.on('requestGameList', sendGameList);

    function sendGameList() {
        // Update a list on the game server
        var gameList = new Array();
        for (gameName in games){
            gameList.push({gameName: gameName, users: Object.keys(games[gameName].players).length})
        }
        socket.emit('updateGameList', gameList);
    };

    // Join a game
    socket.on('joinGame', function (data) {
        var gameName = data.gameName;
        var userID = data.userID;

        if (gameName in games)  {
            if ( !(userID in (games[gameName].players) )) {
                games[gameName].players[userID] = socket.id;

                // Join a socket group
                socket.join(gameName);

                socket.emit('gameJoined', {
                    gameName: gameName,
                    players: games[gameName].players
                });

                socket.broadcast.to(gameName).emit('updatePlayerList', games[gameName].players);

            } else {
                socket.emit('showError', 'User already joined the game');
            }

        } else {
            socket.emit('showError', 'Game does not exist');
        }
    });

    // Exit the current game
    socket.on('exitGame', function (data) {
        if (Object.keys(games[gameName].players).length <= 0) {
            delete games[data.gameName];
        } else {
        delete games[data.gameName].players[data.userID];
        }  
    });
};

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