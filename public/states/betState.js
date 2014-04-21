var BetState = function() {
    // Set up any variables you need here.
    this.timer = new Timer(SETTINGS_BET_TIME_LIMIT);
    
}

// You would set up the environment here.
BetState.prototype.enter = function(stateMachine) {
    // Show HUD
    hudDivs.show({bet: "", countdown: ""});
    
    game.currentRound += 1;
    document.getElementById("divBetsRound").innerHTML = game.currentRound;
    
    this.timer.start();
}

// Any update logic would go here. You can also switch
// states from within here by using stateMachine. So meta.
BetState.prototype.update = function(stateMachine) {
    if (this.timer != null) {
        var timeRemaining = this.timer.getTimeRemaining();
        document.getElementById("divBetsTimer").innerHTML = timeRemaining;
        if (timeRemaining == 0)
            document.getElementById("divBetsTimer").innerHTML = "Waiting for server...";
    }
}

// Typically gets called by the state machine when it switches states
BetState.prototype.exit = function() {
    // Probably free resources or something before you leave.

    // functions in ui.js
    clearBettingInterface();


    hudDivs.hideAll();
}