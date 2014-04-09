// Game class object
var Game = function() {
    this.name = "";
    this.round = 0;   
    this.players = new Array();
}

Game.prototype.initializeGame = function(data) {
    console.log("gameName: " + data.gameName);
    console.log("players: " + data.players);
    
}