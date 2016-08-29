// See game.js
var game = new Game();
var userID = "";
var userData;
var gameList;

// Assigning functions to html buttons
var htmlDocument = $(document);
htmlDocument.on('click', '#btnSignIn', onSignInClick);
htmlDocument.on('click', '#btnCreateGame', onCreateClick);
htmlDocument.on('click', '#btnJoinGame', onJoinClick);
htmlDocument.on('click', '#btnExitGame', onExitClick);
htmlDocument.on('click', '#btnReturnToLobby', onReturnToLobbyClick);

function onSignInClick() {
    userID = $(txtUserID).val();
    
    // DEMO MODE
    var userData = new Array();
    userData.email = "demomode@horsuraysu.com";
    userData.firstname = "Demo";
    userData.lastname = "Mode";
    userData.loginmethod = "??";
    userData.moneez = "1000";
    onSignedIn(userData);
}

function onSignedIn (data){
    userData = data;
    console.log(data);
    document.getElementById("divUserName").innerHTML = userData.email;
    document.getElementById("divGMonies").innerHTML = '<span class="gold">$</span>' + userData.moneez;
    gameStateMachine.changeState(new LobbyState());
    
}

function onBetClick (_hMoney, totalbets) {
    if(totalbets > 0) {
        
    }
}

function onGameOver(data) {
    console.log(data[userID]);
    document.getElementById("divEarning").innerHTML = '<p class="lead">Your earnings, $' + data[userID]
    hChance = new Array(0,0,0,0,0,0,0,0);
}

function onCreateClick() {
    var gameName = $(txtCreateGame).val();    

    // Checks if gameName is undefined
    if(gameName != "") {
        console.log('Game name: ' + gameName);
        console.log('User ID: ' + userID);
        console.log('Clicked "Create a game"');
        
    } else
        showError("err: No gamename nor too many games on the server" );
         
    // DEMO MODE: Join game
    var gameData = new Array();
    gameData.gameName = "Demo Game";
    gameData.players = 1;
    onGameJoined(gameData);
       
}

function onJoinClick(nameOfGame) {
    var gameName = nameOfGame;
    
    for(var hi = 0; hi < 8; hi++){
        $('#hMoney' + (hi)).html(0);
    }

    for(var hi = 0; hi < 8; hi++){
        $('#hChance' + (hi)).html(0);
    }

    if(gameName != "") {
        
    } else {
        showError("err: No gamename");
    }
        
}

function onExitClick() {
    game = new Game();
    gameStateMachine.changeState(new LobbyState());
    
}

function onGameJoined(data) {
    game.initializeGame(data);
    gameStateMachine.changeState(new GameJoinedState());

}

function onAnimateBoard() {
    gameStateMachine.changeState(new AnimateState());
}

function startGameNotify() {
    console.log("Start Game");
    gameStateMachine.changeState(new BetState());
}

// Return to lobby from game over state
function onReturnToLobbyClick() {
    game = new Game();
    gameStateMachine.changeState(new LobbyState());
    
}

function updatePlayerList(players) {
    game.updatePlayerList(players);
    
}


function showError(data) {
    console.log('err: ' + data);
    alert(data);
    
}
