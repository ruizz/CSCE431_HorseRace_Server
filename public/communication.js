// See game.js
var game = new Game();
var userID = "";
var gameList;

// Assigning functions to html buttons
var htmlDocument = $(document);
htmlDocument.on('click', '#btnSignIn', onSignInClick);
htmlDocument.on('click', '#btnCreateGame', onCreateClick);
htmlDocument.on('click', '#btnJoinGame', onJoinClick);
htmlDocument.on('click', '#btnExitGame', onExitClick);

// Binding events
var ioSocket = io.connect();
ioSocket.on('connected', onConnected);
ioSocket.on('gameJoined', onGameJoined);
ioSocket.on('updateGameList', updateGameList);
ioSocket.on('updatePlayerList', updatePlayerList);
ioSocket.on('showError', showError);

function onSignInClick() {
    userID = $(txtUserID).val();
    gameStateMachine.changeState(new LobbyState());
}

function onCreateClick() {
    var gameName = $(txtCreateGame).val();    

    // Checks if gameName is undefined
    if(gameName != "") {
        console.log('Game name: ' + gameName);
        console.log('User ID: ' + userID);
        console.log('Clicked "Create a game"');
        game.gameName = gameName;
        ioSocket.emit('createNewGame', { gameName: gameName, userID: userID });
        
    } else
        IO.showError("err: No gamename");
            
}

function onJoinClick() {
    var gameName = $(txtJoinGame).val()
    
    if(gameName != "") {
        ioSocket.emit('joinGame', { gameName: gameName, userID: userID });
    } else {
        IO.showError("err: No gamename");
    }
        
}

function onExitClick() {
    ioSocket.emit('exitGame', {gameName: game.gameName, userID: userID});

}

function onConnected(data) {
    console.log("   msg: " + data.message);
    
}

function onGameJoined(data){
    game.initializeGame(data);

}

// This function is called after creating a new game
// data has two variables gameName & users(number of users in the game)
function updateGameList(data) {
    gameList = data;
    for (i in gameList){
        console.log(data[i].gameName + ", " + data[i].users); 
    }
    
}

function updatePlayerList(players) {
    game.updatePlayerList(players);
    
}


function showError(data) {
    console.log('err: ' + data);
    alert(data);
    
}
