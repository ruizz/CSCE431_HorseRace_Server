var LobbyState = function() {
    // Set up any variables you need here.
}

// You would set up the environment here.
LobbyState.prototype.enter = function(stateMachine) {
    // Show HUD
    hudDivs.show({lobby: ""});
    
    // Fog
    scene.fog = new THREE.Fog(THEME_HORSU[2], 1, 50);
    
    // Clear all text boxes.
    document.getElementById("txtCreateGame").value = "";
    
    // Reset horse positions.
    board.reset();
    
    // update game list
    ioSocket.emit('requestGameList');
}

// Any update logic would go here. You can also switch
// states from within here by using stateMachine. So meta.
LobbyState.prototype.update = function(stateMachine) {
    
}

// Typically gets called by the state machine when it switches states
LobbyState.prototype.exit = function() {
    // Probably free resources or something before you leave.
    hudDivs.hideAll();
    
}