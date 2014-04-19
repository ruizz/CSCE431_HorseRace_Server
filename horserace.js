var io;
var games = {};

var Game = require('./game.js');

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
            var game = new Game(gameName, io);
            games[gameName] = game;

            // console.log(games[gameName].players);
            if ( !(userID in (games[gameName].players) )) {
                games[gameName].players[userID] = socket.id; // User Identifier

                // Join a socket group
                socket.join(gameName);
                
                socket.emit('gameJoined', {
                    gameName: gameName,
                    players: games[gameName].players
                });
                // var numPlayers = 
                sendGameList();
                
            } else {
                socket.emit('showError', 'User already joined the game');
            }
        }
    });
    
    // Sending a client a list of games
    socket.on('requestGameList', sendGameList);
    function sendGameList() {
        // Update a list on the game server
        var gameList = new Array();
        for (gameName in games){
            gameList.push({gameName: gameName, users: Object.keys(games[gameName].players).length})
        }
        io.sockets.emit('updateGameList', gameList);
        // console.log("Users in gameList.users: " + gameList[0].users);
        // return gameList[0].users;
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
                
                //var numPlayers = 
                sendGameList();
                //console.log('Number of players: ' + numPlayers);
                if (Object.keys(games[gameName].players).length > 1)//numPlayers > 1)
                {
                    console.log("starting the Game");
                    io.sockets.in(gameName).emit('startGame');
                    //game.enactRound();
                    games[gameName].enactRound();
                }
                
            } else {
                socket.emit('showError', 'User already joined the game');
            }

        } else {
            socket.emit('showError', 'Game does not exist');
        }
    });

    // Exit the current game
    socket.on('exitGame', function (data) {
        delete games[data.gameName].players[data.userID];
        if (Object.keys(games[data.gameName].players).length <= 0) {
            delete games[data.gameName];
        }
    });
};