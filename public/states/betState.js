var BetState = function() {
    // Set up any variables you need here.
    
}

// You would set up the environment here.
BetState.prototype.enter = function(stateMachine) {
    // Show HUD
    hudDivs.show({bet: ""});
    
}

// Any update logic would go here. You can also switch
// states from within here by using stateMachine. So meta.
BetState.prototype.update = function(stateMachine) {
    
    
}

// Typically gets called by the state machine when it switches states
BetState.prototype.exit = function() {
    // Probably free resources or something before you leave.
    hudDivs.hideAll();
}