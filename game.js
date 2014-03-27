var io;
var gameSocket;
var games = {};

exports.initGame = function(sio, socket){
    console.log('game.js - initGame Called');
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    // TODO: Timer, round func
    gameSocket.on('createNewGame', createNewGame);
    // gameSocket.on('hostRoomFull', hostPrepareGame);

    // Player Events
    // TODO:
};

function createNewGame(gameName) {
    // TODO: Generating unique Game ID...
    if(gameName in games) { // gameName already exist
        this.emit('showError', 'the same game name already exist..');
    } else {
        var game = new Game(gameName);
        games[gameName] = game;

        // console.log('   Game ID:' + gid);
        console.log('   Socket ID:' + this.id);
        console.log('   Game Name: ' + gameName);

        console.log('   Num Games:' + Object.keys(games).length);
        // this.emit('newGameCreated', {game: game, sid: this.id});
        this.emit('updateGameList', games);
        gid++;    
    }
}

function Game(gName) {
    this.gameName = gName;
    this.turn = 0;
    this.timer = 0;
    this.moves = createArray(8,10);
    // console.log(moves.length);
    // console.log(moves[0].length);

    var row = this.moves.length;
    var col = this.moves[0].length;

    // TODO: Generating rands moves for each turn
    for (var i = 0; i < row; i++){
        for (var j= 0; j < col; j++){
            this.moves[i][j] = 1;
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