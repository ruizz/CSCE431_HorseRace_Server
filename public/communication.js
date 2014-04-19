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
htmlDocument.on('click', '#btnReturnToLobby', onReturnToLobbyClick);

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
        ioSocket.emit('createNewGame', { gameName: gameName, userID: userID });
        
    } else
        showError("err: No gamename");
            
}

function onJoinClick(nameOfGame) {
    var gameName = nameOfGame;
    
    if(gameName != "") {
        ioSocket.emit('joinGame', { gameName: gameName, userID: userID });
    } else {
        showError("err: No gamename");
    }
        
}

function onExitClick() {
    ioSocket.emit('exitGame', {gameName: game.gameName, userID: userID});
    gameStateMachine.changeState(new LobbyState());
    
}

function onConnected(data) {
    console.log("   msg: " + data.message);
    
}

function onGameJoined(data){
    game.initializeGame(data);
    gameStateMachine.changeState(new GameJoinedState());

}

// This function is called after creating a new game
// data has two variables gameName & users(number of users in the game)
function updateGameList(data) {
    gameList = data;
    
    for (i in gameList){
        console.log(data[i].gameName + ", " + data[i].users); 
    }
    
    // Parse some new HTML Code if there are games available.
    var listContent = "";
    console.log('1' + data);
    if (gameList.length >= 1) {
        for (var i = 0; i < gameList.length; i++) {
            console.log(gameList[i].gameName);
            listContent += "<a href=\"#\" class=\"list-group-item\" ";
            listContent += "onclick=\"onJoinClick('" + gameList[i].gameName + "');return false;\">";
            listContent += "<span class=\"badge\">" + gameList[i].users + "</span>" + gameList[i].gameName + "</a>";
        }
    } else {
        listContent += "<a href=\"#\" class=\"list-group-item\">";
        listContent += "<span class=\"badge\">0</span>No games available...</a>";
    } 
    
    document.getElementById("divLobbyList").innerHTML = listContent;
}

// Return to lobby from game over state
function onReturnToLobbyClick() {
    gameStateMachine.changeState(new LobbyState());
    
}

function updatePlayerList(players) {
    game.updatePlayerList(players);
    
}


function showError(data) {
    console.log('err: ' + data);
    alert(data);
    
}
