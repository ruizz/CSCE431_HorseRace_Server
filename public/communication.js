// Client variables
var gameId = 0;
var socketId = "";
var role = "";
var round = 0;
var players = {};
var isNewGame = false;
var numberOfPlayers = 0;

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
ioSocket.on('newGameCreated', onNewGameCreated );
ioSocket.on('updateGameList', updateGameList );
ioSocket.on('showError', showError );

//TODO
// ioSocket.on('gameJoined', IO.onGameJoined );

// TODO: Consider moving all of these functions somewhere else.

//TODO
function onConnected() {
    // Cache a copy of the client's socket.IO session ID on the socketId = ioSocket.socket.sessionid;
    // console.log(data.message);
    
}

//TODO
function onNewGameCreated(game) {
        // Game.gameInit(data);
        
}

function showError(data) {
    console.log('err: ' + data);
    alert(data);
    
}

function gameInit(game){
    gameId = data.gameId;
    
}

//TODO
function gameJoin(data){

}

function updateGameList(games) {
    console.log('Num Games:' + Object.keys(games).length);
    for (var key in games) {
        console.log('ccc: ' + games[key]['gameName']);
    
    }
    
}

function onCreateClick() {
        var gameName = $(txtCreateGame).val()
        //TODO: check gameName is undefined

        console.log('Game name: ' + gameName);
        console.log('Clicked "Create a game"');

        ioSocket.emit('createNewGame', gameName);
        
}

function onJoinClick() {
        var gameName = $(txtJoinGame).val()
        //TODO: check gameName is undefined

        console.log('Game name: ' + gameName);
        console.log('Clicked "Join a game"');

        ioSocket.emit('joinGame', gameName);
        
}
