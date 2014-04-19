var LobbyState = function() {
    // Set up any variables you need here.
}

// You would set up the environment here.
LobbyState.prototype.enter = function(stateMachine) {
    // Set up background color
    renderer.setClearColor(SETTINGS_LIGHT_THEME[3], 1);
    
    // Camera position hasn't changed. No need to do anything to that.
 
    // Show HUD
    
}

// Any update logic would go here. You can also switch
// states from within here by using stateMachine. So meta.
LobbyState.prototype.update = function(stateMachine) {
    
}

// Typically gets called by the state machine when it switches states
LobbyState.prototype.exit = function() {
    // Probably free resources or something before you leave.
    hideAllDivs();
    
}