// Game class object
var Game = function() {
    this.gameName = "";
    this.players = {};
    this.currentRound = 0;
}

Game.prototype.initializeGame = function(data) {
	this.gameName = data.gameName;
	this.players = data.players;
    this.currentRound = 0;
    
}

Game.prototype.updatePlayerList = function(_players) {
    this.players = _players;
    
}