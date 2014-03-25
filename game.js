var io;
var gameSocket;

exports.initGame = function(sio, socket){
    console.log('game.js - initGame Called');
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    // TODO: Timer, round func
    gameSocket.on('hostCreateNewGame', hostCreateNewGame);
    // gameSocket.on('hostRoomFull', hostPrepareGame);

    // Player Events
    // TODO:
}

function hostCreateNewGame() {
    // Create a unique Socket.IO Room
    var _gid = ( Math.random() * 100000 ) | 0;
    
    // Return the Room ID (gid) and the socket ID (sid) to the browser client
    // this.emit('newGameCreated', {gid: thisGameId, sid: this.id});
    console.log('   Game ID:' + _gid);
    console.log('   Socket ID:' + this.id);

    // Join the Room and wait for the players
    // this.join(thisGameId.toString());
};

