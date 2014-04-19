// A container that holds all of the HUD divs for the game.
var HudDivs = function() {
    // Define all of the elements upon creation
    this.divs = {
        title: document.getElementById("divTitle")
    }
    
}

// Hide all divs. Best to do so when switching states.
HudDivs.prototype.hideAll = function() {
    this.divs.title.style.display = "none";
        
}

HudDivs.prototype.show = function(parameters) {
    for (var div in parameters) {
        this.divs[div].style.display = "inline";
    }
    
}