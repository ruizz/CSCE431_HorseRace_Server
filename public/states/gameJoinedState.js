var GameJoinedState = function() {
    // Set up any variables you need here.
}

// You would set up the environment here.
GameJoinedState.prototype.enter = function(stateMachine) {
    // Show HUD
    hudDivs.show({waiting: ""});
    
    document.getElementById("divWaitingTitle").innerHTML = "Entered game: " + game.gameName;
}

// Any update logic would go here. You can also switch
// states from within here by using stateMachine. So meta.
GameJoinedState.prototype.update = function(stateMachine) {
    
}

// Typically gets called by the state machine when it switches states
GameJoinedState.prototype.exit = function() {
    // Probably free resources or something before you leave.
    hudDivs.hideAll();
    
}