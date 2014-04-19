// Game class object
var Game = function() {
    this.gameName = "";
    this.players = {};
}

Game.prototype.initializeGame = function(data) {
	this.gameName = data.gameName;
	this.players = data.players;

}

Game.prototype.updatePlayerList = function(_players) {
    this.players = _players;
    
}