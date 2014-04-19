var LobbyState = function() {
    // Set up any variables you need here.
}

// You would set up the environment here.
LobbyState.prototype.enter = function(stateMachine) {
    // Show HUD
    hudDivs.show({lobby: ""});
    var listContent = "<a href=\"#\" class=\"list-group-item \"><span class=\"badge\">14</span>Cras justo odio</a>"
    document.getElementById("listLobby").innerHTML = listContent;
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