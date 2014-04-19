var TitleState = function() {
    // Set up any variables you need here.
}

// You would set up the environment here.
TitleState.prototype.enter = function(stateMachine) {
    // Set up background color
    renderer.setClearColor(SETTINGS_LIGHT_THEME[4], 1);
    
    // Set up camera position and where it should look at.
    camera.position.y = SETTINGS_CAMERA_START_Y;
    camera.position.z = SETTINGS_CAMERA_START_Z;
    camera.lookAt(SETTINGS_CAMERA_START_LOOKAT);
    
    // Board chain
    tweenBoard = new TWEEN.Tween(board.parentObject.rotation)
        .to({y: SETTINGS_TITLE_BOARD_TWEEN_ANGLE}, SETTINGS_TITLE_BOARD_TWEEN_TIME)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(function() {board.parentObject.rotation.y = 0});

    tweenBoard.chain(tweenBoard);
    
    // Start both tweens
    tweenBoard.start();
    
    // Show title HUD
    hudDivs.show({title: ""});
    
}

// Any update logic would go here. You can also switch
// states from within here by using stateMachine. So meta.
TitleState.prototype.update = function(stateMachine) {
    
    TWEEN.update();
    
}

// Typically gets called by the state machine when it switches states
TitleState.prototype.exit = function() {
    // Probably free resources or something before you leave.
    hideAllDivs();
    
}