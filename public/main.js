// Variables
// Three.js essential items.
var renderer, scene, loader, camera;
var ambientLight, pointLight;
var tileGeometry, horseGeometry;

// Three is drawn in this div
var container = document.getElementById('boardContainer');

// Game board, complete with tiles and horses
var board;

// All of the different HTML-based HUD divs.
var hudDivs;

// Game state machine. Used to switch between different game states.
var gameStateMachine;

// ACTION!
init();
render();

function init() {
	// Define renderer, scene, loader, and camera, and the board.
	renderer = new THREE.WebGLRenderer({antialias: true});
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
	
	// Create a new board.
	board = new Board();
	
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
	
	// Set up ambient light
	ambientLight = new THREE.AmbientLight(SETTINGS_LIGHT_THEME[3]);
	scene.add(ambientLight);
	
	// Set up point light
	pointLight = new THREE.DirectionalLight(SETTINGS_LIGHT_THEME[1], 0.75);
	pointLight.position.x = 0;
	pointLight.position.y = 20;
	pointLight.position.z = 0;
	scene.add(pointLight);
	
	// Listener for window resize
	window.addEventListener('resize', onWindowResize, false);
	
	// Instantiate a collection of all of the HUD divs.
	hudDivs = new HudDivs();
	hudDivs.hideAll();
		
	// Start the game state machine, beginning with the title state
	gameStateMachine = new StateMachine(new TitleState());
	
}

function render() {
	TWEEN.update();
	gameStateMachine.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	
};

// Key press. To check unicode numbers:
// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
function onKeyDown(e) {
	// e.g. '0' key is 48 in unicode, '1' is 49, etc.
	var unicode = e.keyCode? e.keyCode : e.charCode;
	
	// if (unicode >= 48 && unicode <= 55) {
	// 	// Random number from 1 to 3.
	// 	var random = Math.floor(Math.random() * SETTINGS_BOARD_HORSE_MOVE_LIMIT) + 1;
	// 	board.moveHorse(unicode - 48, random);
	
	// } 
	// // [SPACE] to reset
	// else if (unicode == 32) {
	// 	board.resetBoard();
		
	// }
	// // Random board state generation with [R]
	// else if (unicode == 82) {
	// 	// Generate array
	// 	var newPositions = new Array();
	// 	for (var i = 0; i < SETTINGS_BOARD_HORSE_MOVE_TOTAL_LIMIT; i++) {
	// 		newPositions[i] = Math.floor(Math.random() * SETTINGS_BOARD_HORSE_MOVE_TOTAL_LIMIT) + 1;
		
	// 	}
	
	// 	board.changeBoardState(newPositions);
	
	// }
	
	// For debug only.
	if (unicode == 32 && gameStateMachine.getCurrentState() instanceof GameJoinedState)
		gameStateMachine.changeState(new BetState());
}

// Window resize.
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}