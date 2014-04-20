var io;
var games = {};

var Game = require('./game.js');
var request = require('request');

exports.init = function(sio, socket){
    console.log('horserace.js - initGame Called');
    io = sio;
    socket.emit('connected', { message: 'You are connected!' });

    socket.on('signInGame', function(userID) {
        request({uri:'http://heroku-team-bankin.herokuapp.com/services/account/get/' + userID, json:{}} , function (error, response, body) {
            if (!error && response.statusCode == 200) {
                socket.emit('signedIn', body);
            } else {
                socket.emit('showError', 'err: Please check your user ID');
            }
        })
    });

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
                console.log("start 15 second wait timer");
                games[gameName].setTimer(games[gameName].getNewTime(), 15000);
                games[gameName].intervalID = setInterval(checkGamesTimer.bind(games[gameName]),1000);
                // console.log(games[gameName].intervalID);
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
            if (games[gameName].gameReady == true ) {
                gameList.push({gameName: gameName, users: Object.keys(games[gameName].players).length})
 
            }
        }
        io.sockets.emit('updateGameList', gameList);
        // console.log("Users in gameList.users: " + gameList[0].users);
        // return gameList[0].users;
    };

    function checkGamesTimer() {
        if ((new Date).getTime() >= games[gameName].targetTime) {
            //Tell the game that it is ready
            clearInterval(games[gameName].intervalID);
            console.log("starting the Game");
            games[gameName].gameReady = false;
            io.sockets.in(gameName).emit('startGame');
            games[gameName].enactRound();
            //Clear the repeating timer check
            
        }
    }

    // Join a game
    socket.on('joinGame', function (data) {
        var gameName = data.gameName;
        var userID = data.userID;

        if (gameName in games)  {
            if ( !(userID in (games[gameName].players) ) && (games[gameName].gameReady == true)) {
                games[gameName].players[userID] = socket.id;

                // Join a socket group
                socket.join(gameName);

                socket.emit('gameJoined', {
                    gameName: gameName,
                    players: games[gameName].players
                });

                socket.broadcast.to(gameName).emit('updatePlayerList', games[gameName].players);

                sendGameList();
                // if (games[gameName].gameReady == true)
                // {
                //     console.log("starting the Game");
                //     io.sockets.in(gameName).emit('startGame');
                //     //game.enactRound();
                //     games[gameName].enactRound();
                // }

            } else {
                socket.emit('showError', 'Unable to join game');
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

    socket.on('withdrawMoney', function (data) {
        request.put({
            uri: 'http://heroku-team-bankin.herokuapp.com/services/account/withdraw',
            json: {email: data.email, withdraw:data.withdraw}
        }, function (error, response, body) {
            console.log(body);
            if (!error && response.statusCode == 200) {
                socket.emit('withdrawConfirmed', body);
            } else {
                socket.emit('showError', 'err: Failed to withdraw money');
            }
        })
    });

    socket.on('betRequest', function (data) {
        // Havent tested yet
        games[data.gameName].horseBetValues[data.horseNumber] += data.money;
        games[data.gameName].userMoney[data.email][data.horseNumber] += data.money;
        socket.emit('updateUserMoneyOnHorses', game[data.gameName].userMoney[data.email]);
        games[data.gameName].updateTotal();
        io.sockets.in(data.gameName).emit('updateMoneyOnHorses', games[data.gameName].horseBetValues);
    });
};