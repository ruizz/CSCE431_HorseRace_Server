var TitleState = function() {
    // Set up any variables you need here.
}

// You would set up the environment here.
TitleState.prototype.enter = function(stateMachine) {
    // Set up background color
    renderer.setClearColor(THEME_HORSU[2], 1);
    
    // Set up basic lighting
    hemisphereLight = new THREE.HemisphereLight(THEME_HORSU[2], THEME_HORSU[3]);
    scene.add(hemisphereLight);
    
    // Fog
    scene.fog = new THREE.Fog(THEME_HORSU[2], 1, 50);
    
    // Set up camera position and where it should look at.
    camera.position.y = SETTINGS_CAMERA_START_Y;
    camera.position.z = SETTINGS_CAMERA_START_Z;
    camera.lookAt(SETTINGS_CAMERA_START_LOOKAT);
    
    // Board chain
    this.tweenBoard = new TWEEN.Tween(board.parentObject.rotation)
        .to({y: SETTINGS_TITLE_BOARD_TWEEN_ANGLE}, SETTINGS_TITLE_BOARD_TWEEN_TIME)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(function() {board.parentObject.rotation.y = 0});

    this.tweenBoard.chain(this.tweenBoard);
    
    // Start tween
    this.tweenBoard.start();
    
    // Show title HUD
    hudDivs.show({title: ""});
    
    // Clear all text boxes.
    // document.getElementById("txtUserID").value = "person5@test.com";
    document.getElementById("txtUserID").value = getUrlVars()["email"]; 
}

// Any update logic would go here. You can also switch
// states from within here by using stateMachine. So meta.
TitleState.prototype.update = function(stateMachine) {
    
}

// Typically gets called by the state machine when it switches states
TitleState.prototype.exit = function() {
    // Probably free resources or something before you leave.
    this.tweenBoard.stop();
    this.tweenBoard = new TWEEN.Tween(board.parentObject.rotation)
        .to({y: 0}, 2000)
        .easing(TWEEN.Easing.Quintic.Out);
    
    this.tweenBoard.start();
        
    hudDivs.hideAll();

}

// http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}