// Game class object
var Game = function() {
    this.name = "";
    this.players = new Array();
}

Game.prototype.initializeGame = function(data) {
	name = data.gameName;
	players = data.players;

}

Game.prototype.updatePlayerList = function(_players) {
    players = _players;
    
}

Game.prototype.removePlayer = function(player) {
    players = _players;
    
}