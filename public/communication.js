// Client variables
var gameId = 0;
var socketId = "";
var role = "";
var round = 0;
var players = {};
var isNewGame = false;
var numberOfPlayers = 0;

// See game.js
var game = new Game();

// What is this?
var Player = {
    hostId : '',
    userId : '',
}

// Assigning functions to html buttons
var htmlDocument = $(document);
htmlDocument.on('click', '#btnCreateGame', onCreateClick);
htmlDocument.on('click', '#btnJoinGame', onJoinClick);

// Binding events
var ioSocket = io.connect();
ioSocket.on('connected', onConnected);
ioSocket.on('newGameCreated', onNewGameCreated);
ioSocket.on('gameJoined', onGameJoined);
ioSocket.on('updateGameList', updateGameList);
ioSocket.on('showError', showError);

function onConnected(data) {
    // Cache a copy of the client's socket.IO session ID on the socketId = ioSocket.socket.sessionid;
    // console.log(data.message);
    socketId = ioSocket.sessionid;
    console.log("socketId: " + socketId);
    console.log("msg: " + data.message);
    
}

function onNewGameCreated(data) {
    game.initializeGame(data);
        
}

function updateGameList(games) {
    console.log('Num Games:' + Object.keys(games).length);
    console.log('games: ' + games);
    
}

function onGameJoined(data){
    // Merge from 'Scratch' note:
    // This function wasn't defined.
    // App.joinGame(data);
}

function showError(data) {
    console.log('err: ' + data);
    alert(data);
    
}

function onCreateClick() {
        var gameName = $(txtCreateGame).val()
        // Checks if gameName is undefined
        if(gameName != "") {
            console.log('Game name: ' + gameName);
            console.log('Clicked "Create a game"');
            ioSocket.emit('createNewGame', gameName);
            
        } else
            IO.showError("err: No gamename");
            
}

function onJoinClick() {
        var gameName = $(txtJoinGame).val()
        //TODO: check gameName is undefined

        console.log('Game name: ' + gameName);
        console.log('Clicked "Join a game"');

        ioSocket.emit('joinGame', gameName);
        
}
