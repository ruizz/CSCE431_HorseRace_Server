var io;
var gameSocket;
var games = {};

var globalVar = 0;

exports.initGame = function(sio, socket){
    console.log('game.js - initGame Called');
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    // TODO: Timer, round func
    gameSocket.on('createNewGame', createNewGame);
    gameSocket.on('joinGame', joinGame);

    // Player Events
    // TODO:
};

function createNewGame(gameName) {
    // TODO: Generating unique Game ID...
    if(gameName in games) { // gameName already exist
        gameSocket.emit('showError', 'the same game name already exist..');
    } else {
        var game = new Game(gameName);
        games[gameName] = game;
        games[gameName][gameSocket.id] = gameSocket;
        // console.log('   Game ID:' + gid);
        console.log('   Socket ID:' + gameSocket.id); // client
        console.log('   Game Name: ' + gameName);
        console.log('   Num Games:' + Object.keys(games).length);
        
        // For testing
        console.log('   GlobalVar: ' + globalVar++);
        gameSocket.emit('newGameCreated', JSON.stringify(game));
        // this.emit('updateGameList', Object.keys(games));   
    }
}

function joinGame(ganeName){
    if(!(gameName in games)) { // gameName already exist
        gameSocket.emit('showError', 'the game does not exist');
    } else {
        games[gameName][gameSocket.id] = gameSocket;
        // console.log('   Game ID:' + gid);
        console.log('   Socket ID:' + gameSocket.id);
        console.log('   Game Name: ' + gameName);
        console.log('   Users:');
        for (var sid in games[gameName]){
            console.log('        - ' + sid);
        }
    }
}

function Game(gName) {
    var gameName = gName;
    var turn = 0;
    var timer = 0;
    var moves = createArray(8,10);
    // this.players = [];
    // console.log(moves.length);
    // console.log(moves[0].length);

    var row = moves.length;
    var col = moves[0].length;

    // TODO: Generating rands moves for each turn
    for (var i = 0; i < row; i++){
        for (var j= 0; j < col; j++){
            moves[i][j] = 1;
        }
    }
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