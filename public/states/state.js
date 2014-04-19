// Javascript doesn't necessarily have interfaces like Java and C#.
// Consider this a boilerplate template for a game state. It won't
// be used by the game, but all game states should have these methods.

var State = function() {
    // Set up any variables you need here.
}

// You would set up the environment here.
State.prototype.enter = function(stateMachine) {
    // Set up background color?
    // Set up camera position and where it should look at?
    // Show HUD?
    
}

// Any update logic would go here. You can also switch
// states from within here by using stateMachine. So meta.
State.prototype.update = function(stateMachine) {
    
}

// Typically gets called by the state machine when it switches states
State.prototype.exit = function() {
    // Probably free resources or something before you leave.
    
}