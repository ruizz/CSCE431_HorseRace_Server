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

// TODO
htmlDocument.on('click', '#btnBet', onBetClick);

// Binding events
var ioSocket = io.connect();
ioSocket.on('connected', onConnected);
ioSocket.on('signedIn', onSignedIn);
ioSocket.on('gameJoined', onGameJoined);
ioSocket.on('updateGameList', updateGameList);
ioSocket.on('updatePlayerList', updatePlayerList);
ioSocket.on('animateBoard', onAnimateBoard);
ioSocket.on('updateHorsePositions', updateHorsePositions);
ioSocket.on('startGame', startGameNotify);
ioSocket.on('showError', showError);
ioSocket.on('withdrawConfirmed', onWithdrawConfirmed)

function onSignInClick() {
    userID = $(txtUserID).val();
    ioSocket.emit('signInGame', userID);
}

function onSignedIn (data){
    userData = data;
    gameStateMachine.changeState(new LobbyState());
    console.log(data);
    console.log(userData.email);
    console.log(userData.firstname);
    console.log(userData.lastname)
    console.log(userData.loginmethod);
    console.log(userData.moneez);
}

function onBetClick () {
    // TODO: Where we get this value?!
    var money = 10; // Total amount money a user bets on the horses.
    userID = 'person3@test.com';
    // Withdraw money
    ioSocket.emit('withdrawMoney', {email: userID, withdraw:money});
}

function onWithdrawConfirmed(data) {
    var horseNumber = 0;
    console.log(data);
    ioSocket.emit('betRequest', {
        email: data.userID,
        horseNumber: horseNumber,
        money: data.money,
        gameName: game.gameName
    });
}

// Receiving data for money on horses
function onUpdateBets(data) {
    moneyOnHorses = data;
    // TODO: update "ratio"
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
