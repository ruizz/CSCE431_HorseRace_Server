var Communicator = function() {
    // Client variables
    this.gameId = 0;
    this.socketId = "";
    this.role = "";
    this.round = 0;
    this.opponents = {};
    this.isNewGame = false;
    this.numberOfPlayers = 0;
    
    // What is this?
    this.player = {
        hostId : '',
        userId : '',
    }
    
    // Assigning functions to html buttons
    this.htmlDocument = $(document);
    this.htmlDocument.on('click', '#btnCreateGame', this.onCreateClick);
    this.htmlDocument.on('click', '#btnJoinGame', this.onJoinClick);
    
    // Binding events
    this.ioSocket = io.connect();
    this.ioSocket.on('connected', this.onConnected);
    this.ioSocket.on('newGameCreated', this.onNewGameCreated);
    this.ioSocket.on('updateGameList', this.updateGameList);
    this.ioSocket.on('showError', this.showError);
    
}


// TODO: Consider moving all of these functions somewhere else.

//TODO
Communicator.prototype.onConnected = function() {
    // Cache a copy of the client's socket.IO session ID on the this.socketId = ioSocket.socket.sessionid;
    // console.log(data.message);
    
}

//TODO
Communicator.prototype.onNewGameCreated = function(game) {
        // Game.gameInit(data);
        
}

Communicator.prototype.showError = function(data) {
    console.log('err: ' + data);
    alert(data);
    
}

Communicator.prototype.gameInit = function(game){
    this.gameId = data.this.gameId;
    
}

//TODO
Communicator.prototype.gameJoin = function(data){

}

Communicator.prototype.updateGameList = function(games) {
    console.log('Num Games:' + Object.keys(games).length);
    for (var key in games) {
        console.log('ccc: ' + games[key]['gameName']);
    
    }
    
}

Communicator.prototype.onCreateClick = function() {
        var gameName = $(txtCreateGame).val()
        //TODO: check gameName is undefined

        console.log('Game name: ' + gameName);
        console.log('Clicked "Create a game"');

        ioSocket.emit('createNewGame', gameName);
        
}

Communicator.prototype.onJoinClick = function() {
        var gameName = $(txtJoinGame).val()
        //TODO: check gameName is undefined

        console.log('Game name: ' + gameName);
        console.log('Clicked "Join a game"');

        ioSocket.emit('joinGame', gameName);
        
}
