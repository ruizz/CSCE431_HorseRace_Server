var AnimateState = function() {
    // Set up any variables you need here.
    
    // Temporarily creating random positions.
    // The server needs to return the correct positions.
    this.randomArray = new Array();
     for (var i = 0; i < SETTINGS_BOARD_HORSE_MOVE_TOTAL_LIMIT; i++) {
         this.randomArray[i] = Math.floor(Math.random() * SETTINGS_BOARD_HORSE_MOVE_TOTAL_LIMIT) + 1;
     }
}

// You would set up the environment here.
AnimateState.prototype.enter = function(stateMachine) {
    // Show HUD
    hudDivs.show({animate: ""});
    board.changeBoardState(this.randomArray);
}

// Any update logic would go here. You can also switch
// states from within here by using stateMachine. So meta.
AnimateState.prototype.update = function(stateMachine) {
    
    
}

// Typically gets called by the state machine when it switches states
AnimateState.prototype.exit = function() {
    // Probably free resources or something before you leave.
    hudDivs.hideAll();
}