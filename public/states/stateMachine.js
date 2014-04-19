var StateMachine = function(startState) {
    this.currentState = startState;
    this.currentState.enter();
    
}

StateMachine.prototype.changeState = function(newState) {
    this.currentState.exit();
    this.currentState = newState;
    this.currentState.enter();
    
}

StateMachine.prototype.getCurrentState = function() {
    return this.currentState;
    
}

StateMachine.prototype.update = function() {
    this.currentState.update(this);
    
}