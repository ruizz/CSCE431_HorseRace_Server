// Socket variables
var communicator;

// Three.js variables
var renderer, scene, loader, camera;
var backgroundColor, ambientLight, pointLight;
var board;
var horseTween;
var tileGeometry, horseGeometry;
var container = document.getElementById('boardContainer');

// ACTION!
initSocket();
initThree();
render();

function initSocket() {
	communicator = new Communicator();
	
}

function initThree() {
	// Define renderer, scene, loader, and camera, and the board.
	renderer = new THREE.WebGLRenderer({ antialias: true });
	scene = new THREE.Scene();
	loader = new THREE.JSONLoader();
	camera = new THREE.PerspectiveCamera(
		SETTINGS_CAMERA_FOV,
		window.innerWidth / window.innerHeight,
		SETTINGS_CAMERA_NEAR,
		SETTINGS_CAMERA_FAR
		
	);
	
	// Set the renderer size and attach to the HTML body.
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	
	board = new Board();
	
	// Adjust the camera a bit. 
	camera.position.y = SETTINGS_CAMERA_START_Y;
	camera.position.z = SETTINGS_CAMERA_START_Z;
	camera.lookAt(SETTINGS_CAMERA_START_LOOKAT);
	
	// Load the tile geometry and call the board to make tile meshes from the geometry.
	loader.load(
		"models/tileModel.js",
		function(geometry) {
			tileGeometry = geometry;
			board.createTileMeshes();
			
		}
		
	);
	
	// Load the horse geometry and call the board to make horse meshes from the geometry.
	loader.load(
		"models/horseModel.js",
		function(geometry) {
			horseGeometry = geometry;
			board.createHorseMeshes();
			
		}
		
	);
	
	// Set up background color
	renderer.setClearColor(SETTINGS_LIGHT_THEME[4], 1);
	
	// Set up ambient light
	ambientLight = new THREE.AmbientLight(SETTINGS_LIGHT_THEME[3]);
	scene.add(ambientLight);
	
	// Set up point light
	scene.remove(pointLight);
	pointLight = new THREE.PointLight(SETTINGS_LIGHT_THEME[1], 1, 0);
	pointLight.position.x = -25;
	pointLight.position.y = 20;
	pointLight.position.z = -10;
	scene.add(pointLight);
	
	// Camera tween chain
	tweenBoardRight = new TWEEN.Tween(board.parentObject.rotation)
		.to({y: SETTINGS_BOARD_TWEEN_MAX_ANGLE}, SETTINGS_CAMERA_TWEEN_TIME)
		.easing(TWEEN.Easing.Quadratic.InOut);
		
	tweenBoardLeft = new TWEEN.Tween(board.parentObject.rotation)
		.to({y: SETTINGS_BOARD_TWEEN_MIN_ANGLE}, SETTINGS_CAMERA_TWEEN_TIME)
		.easing(TWEEN.Easing.Quadratic.InOut);
	
	tweenBoardRight.chain(tweenBoardLeft);
	tweenBoardLeft.chain(tweenBoardRight);
	
	// Point light tween chain
	tweenLightLeft = new TWEEN.Tween(pointLight.position)
		.to({x: -SETTINGS_BOARD_MIN_MAX_X}, SETTINGS_CAMERA_TWEEN_TIME)
		.easing(TWEEN.Easing.Quadratic.InOut);
	
	tweenLightRight = new TWEEN.Tween(pointLight.position)
		.to({x: SETTINGS_BOARD_MIN_MAX_Z * SETTINGS_BOARD_TILE_SPACING}, SETTINGS_CAMERA_TWEEN_TIME)
		.easing(TWEEN.Easing.Quadratic.InOut);
	
	tweenLightLeft.chain(tweenLightRight);
	tweenLightRight.chain(tweenLightLeft);
	
	// Start both tweens
	tweenBoardRight.start();
	tweenLightRight.start();
	
	// Listener for window resize
	window.addEventListener('resize', onWindowResize, false);
	
}

function render() {
	TWEEN.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	
};

// Key press. To check unicode numbers:
// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
function onKeyDown(e) {
	// e.g. '0' key is 48 in unicode, '1' is 49, etc.
	var unicode = e.keyCode? e.keyCode : e.charCode;
	if (unicode >= 48 && unicode <= 55) {
		// Random number from 1 to 3.
		var random = Math.floor(Math.random() * SETTINGS_BOARD_HORSE_MOVE_LIMIT) + 1;
		board.moveHorse(unicode - 48, random);
	
	} 
	// [SPACE] to reset
	else if (unicode == 32) {
		board.resetBoard();
		
	}
	// Random board state generation with [R]
	else if (unicode == 82) {
		// Generate array
		var newPositions = new Array();
		for (var i = 0; i < SETTINGS_BOARD_HORSE_MOVE_TOTAL_LIMIT; i++) {
			newPositions[i] = Math.floor(Math.random() * SETTINGS_BOARD_HORSE_MOVE_TOTAL_LIMIT) + 1;
		
		}
	
		board.changeBoardState(newPositions);
	
	}
	
}

// Window resize.
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}