var GameJoinedState = function() {
    // Set up any variables you need here.
    this.demoTimer = new Timer(1000);
    
}

// You would set up the environment here.
GameJoinedState.prototype.enter = function(stateMachine) {
    // Show HUD
    hudDivs.show({waiting: ""});
    
    // Fog
    scene.fog = new THREE.Fog(THEME_HORSU[2], 100, 100);
    
    document.getElementById("divWaitingTitle").innerHTML = "Entered game: " + game.gameName;
    
    // DEMO MODE
    this.demoTimer.start();

}

// Any update logic would go here. You can also switch
// states from within here by using stateMachine. So meta.
GameJoinedState.prototype.update = function(stateMachine) {
    if (this.demoTimer != null) {
        var timeRemaining = this.demoTimer.getTimeRemaining();
        if (timeRemaining == 0) {
        	startGameNotify();
        	
        }
            
    }
    
}

// Typically gets called by the state machine when it switches states
GameJoinedState.prototype.exit = function() {
    // Probably free resources or something before you leave.
    hudDivs.hideAll();
}