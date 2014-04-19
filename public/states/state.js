// Javascript doesn't necessarily have interfaces like Java and C#.
// Consider this a boilerplate template for a game state. It won't
// be used by the game, but all game states should have these methods.

var State = function() {
    
}

State.prototype.enter = function(stateMachine) {
    // You would set up the environment here.
}

State.prototype.update = function(stateMachine) {
    // Any update logic would go here.
    
}

State.prototype.exit = function() {
    // Probably free resources or something before you leave.
    
}