// A container that holds all of the HUD divs for the game.
var HudDivs = function() {
    // Define all of the elements upon creation
    this.divs = {
        title: document.getElementById("divTitle"),
        lobby: document.getElementById("divLobby"),
        waiting: document.getElementById("divWaiting"),
        bet: document.getElementById("divBets"),
        countdown: document.getElementById("divCountdown"),
        animate: document.getElementById("divAnimate"),
        gameOver: document.getElementById("divGameOver")
        
    }
    
}

// Hide all divs. Best to do so when switching states.
HudDivs.prototype.hideAll = function() {
    for (var div in this.divs)
        this.divs[div].style.display = "none";
        
}

HudDivs.prototype.show = function(parameters) {
    for (var div in parameters) {
        this.divs[div].style.display = "inline";
    }
    
}