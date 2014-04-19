// Game class object
var Game = function() {
    this.gameName = "";
    this.players = {};
    this.currentRound = 0;
    this.horsePositions = new Array();
}

Game.prototype.initializeGame = function(data) {
	this.gameName = data.gameName;
	this.players = data.players;
    this.currentRound = 0;
    this.horsePositions = new Array();
    
}

Game.prototype.updatePlayerList = function(_players) {
    this.players = _players;
    
}