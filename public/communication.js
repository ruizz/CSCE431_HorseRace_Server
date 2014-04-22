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
htmlDocument.on('click', '#btnAudioMute', onAudioMuteClick);

var sound = new Howl({ urls: ["audio/Horse_Walker_sprite.mp3", "audio/Horse_Walker_sprite.ogg"], sprite: { 
        horse0: [0, 1418], horse1: [1419, 2786], horse2: [2787, 4082], horse3: [4083, 5268], horse4: [5269, 6602], 
        horse5: [6603, 7934], horse6: [7935, 9122], horse7: [7936, 10706]}});


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
ioSocket.on('withdrawConfirmed', onWithdrawConfirmed);
ioSocket.on('updateUserMoneyOnHorses', onUpdateUserMoneyOnHorses);
ioSocket.on('updateMoneyOnHorses', onUpdateMoneyOnHorses);
ioSocket.on('gameOver', onGameOver);
ioSocket.on('updateUserInfo', onUpdateUserInfo);

function onSignInClick() {
    userID = $(txtUserID).val();
    ioSocket.emit('signInGame', userID);
}

function onSignedIn (data){
    userData = data;
    console.log(data);
    document.getElementById("divUserName").innerHTML = userData.email;
    document.getElementById("divGMonies").innerHTML = '<span class="gold">$</span>' + (userData.moneez).toFixed(2);
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
    document.getElementById("divGMonies").innerHTML = '<span class="gold">$</span>' + (userData.moneez).toFixed(2);
}

function onBetClick (_hMoney, totalbets) {
    if(totalbets > 0) {
        if (game.currentRound < 6) {
            ioSocket.emit('withdrawMoney', {email: userID, withdraw:totalbets, hMoney:_hMoney});
        } else {
            showError("Not allowed to bet on horses after 6th round");
        }
    }
}

function onWithdrawConfirmed(data, _hMoney) {
    ioSocket.emit('updateUserInfo', userID);
    console.log(data);
    console.log(_hMoney);
    ioSocket.emit('betRequest', {
        email: userID,
        // horseNumber: horseNumber,
        hMoney: _hMoney,
        gameName: game.gameName
    });
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
    ioSocket.emit('exitGame', {gameName: game.gameName, userID: userID});
    game = new Game();
    gameStateMachine.changeState(new LobbyState());
    
}

function updatePlayerList(players) {
    game.updatePlayerList(players);
    
}

function updateHorsePositions(horses) {
    console.log('Horse Positions: ' + horses);
    game.horsePositions = horses;
    sound.play('horse'+Math.floor((Math.random()*8)));    
}

function onAudioMuteClick() {
    sound.mute();
    
}

function showError(data) {
    console.log('err: ' + data);
    alert(data);
    
}
