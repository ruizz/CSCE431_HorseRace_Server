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
}

function onSignedIn (data){
    userData = data;
    console.log(data);
    document.getElementById("divUserName").innerHTML = userData.email;
    document.getElementById("divGMonies").innerHTML = '<span class="gold">$</span>' + userData.moneez;
    gameStateMachine.changeState(new LobbyState());
    // console.log(data);
    // console.log(userData.email);
    // console.log(userData.firstname);
    // console.log(userData.lastname)
    // console.log(userData.loginmethod);
    // console.log(userData.moneez);
}

function onUpdateUserInfo (data) {
    userData = data;
    document.getElementById("divUserName").innerHTML = userData.email;
    document.getElementById("divGMonies").innerHTML = '<span class="gold">$</span>' + userData.moneez;
}

function onBetClick (_hMoney, totalbets) {
    if(totalbets > 0) {
        
    }
}

function onWithdrawConfirmed(data, _hMoney) {
    console.log(data);
    console.log(_hMoney);

}

function onUpdateMoneyOnHorses (_horseBetValues) {
    game.horseBetValues = _horseBetValues;
    hChance = _horseBetValues;
    for(var hi = 0; hi < hCount; hi++){
        $('#hChance' + (hi)).html(hChance[hi]);
    }
}

function onUpdateUserMoneyOnHorses(_userMoney) {
    game.userMoney = _userMoney
}

// Receiving data for money on horses
function onUpdateBets(data) {
    moneyOnHorses = data;
    // TODO: update "ratio"
}

function onGameOver(data) {
    console.log(data[userID]);
    document.getElementById("divEarning").innerHTML = '<p class="lead">Your earnings, $' + data[userID]
    hChance = new Array(0,0,0,0,0,0,0,0);
}

function onCreateClick() {
    var gameName = $(txtCreateGame).val();    

    // Checks if gameName is undefined
    if(gameName != "" && gameList.length < 5) {
        console.log('Game name: ' + gameName);
        console.log('User ID: ' + userID);
        console.log('Clicked "Create a game"');
        
    } else
        showError("err: No gamename nor too many games on the server" );
            
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

function onConnected(data) {
    console.log("   msg: " + data.message);
    
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

// This function is called after creating a new game
// data has two variables gameName & users(number of users in the game)
function updateGameList(data) {
    gameList = data;
    
    for (i in gameList){
        console.log(data[i].gameName + ", " + data[i].users); 
    }
    
    // Parse some new HTML Code if there are games available.
    var listContent = "";

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
    game = new Game();
    gameStateMachine.changeState(new LobbyState());
    
}

function updatePlayerList(players) {
    game.updatePlayerList(players);
    
}

function updateHorsePositions(horses) {
    console.log('Horse Positions: ' + horses);
    game.horsePositions = horses;
    
}


function showError(data) {
    console.log('err: ' + data);
    alert(data);
    
}
