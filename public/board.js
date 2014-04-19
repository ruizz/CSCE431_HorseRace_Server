var Board = function() {
	this.materialRegular = new THREE.MeshPhongMaterial({
		ambient: THEME_CLAIREDELUNE[2],
		color: THEME_CLAIREDELUNE[2],
		specular: THEME_NEUTRAL[2],
		shininess: 10,
		shading: THREE.SmoothShading,
		
	});
	
	this.materialGoal = new THREE.MeshPhongMaterial({
		ambient: THEME_WINTER_RASPBERRY[1],
		color: THEME_WINTER_RASPBERRY[1],
		specular: THEME_NEUTRAL[2],
		shininess: 10,
		shading: THREE.SmoothShading,
		
	});
	
	// Some variables.
	this.parentObject = new THREE.Object3D();
	this.isHorseMoving = false;
	
	// To be defined by the load helper functions in index.html.
	this.tileMeshes = new Array();
	this.goalMesh = 0;
	this.horseMeshes = new Array();
	this.horsePositions = new Array(); // Indicates which tile column the horses are on.
	this.horseTween = 0;
	this.horseTweens = new Array();
	
	scene.add(this.parentObject);
	
}

Board.prototype.createTileMeshes = function() {
	for (var x = -SETTINGS_BOARD_MIN_MAX_X; x <= SETTINGS_BOARD_MIN_MAX_X; x += SETTINGS_BOARD_TILE_SPACING) {
		for (var z = -SETTINGS_BOARD_MIN_MAX_Z; z <= SETTINGS_BOARD_MIN_MAX_Z; z += SETTINGS_BOARD_TILE_SPACING) {
			var tile;
			if (x == SETTINGS_BOARD_MIN_MAX_X)
				tile = new THREE.Mesh(tileGeometry, this.materialGoal);
			else
				tile = new THREE.Mesh(tileGeometry, this.materialRegular);
			tile.scale.set(1, 1, 1);
			tile.position.x = x;
			tile.position.z = z;
			this.tileMeshes.push(tile);
			this.parentObject.add(tile);
			
		}
		
	}
	
}

Board.prototype.createHorseMeshes = function() {
	for (var z = -SETTINGS_BOARD_MIN_MAX_Z; z <= SETTINGS_BOARD_MIN_MAX_Z; z += SETTINGS_BOARD_TILE_SPACING) {
                
		var horse = new THREE.Mesh(
			horseGeometry, 
			new THREE.MeshPhongMaterial({
                ambient: SETTINGS_HORSE_COLOR[this.horseMeshes.length],
                color: SETTINGS_HORSE_COLOR[this.horseMeshes.length],
                specular: THEME_NEUTRAL[2],
                shininess: 10,
                shading: THREE.SmoothShading,
                transparent: true,
                opacity: 1 // Should be 1. Lower for debugging purposes.

        	})
		);
                
		horse.scale.set(1, 1, 1);
		horse.rotation.y = 90 * SETTINGS_DEG_TO_RAD;
		horse.position.x = -SETTINGS_BOARD_MIN_MAX_X;
		horse.position.y = SETTINGS_BOARD_HORSE_Y;
		horse.position.z = z;
		this.horseMeshes.push(horse);
		this.horsePositions.push(0);
		this.parentObject.add(horse);
                
	}
	
}

Board.prototype.moveHorse = function(which, amount) {
	if (this.horsePositions[which] < SETTINGS_BOARD_HORSE_MOVE_TOTAL_LIMIT && this.isHorseMoving == false) {
		// Block out all other horses from moving.
		this.isHorseMoving = true;
		
		// Prevent horse from moving forward over 19 spaces.
		if (this.horsePositions[which] + amount > SETTINGS_BOARD_HORSE_MOVE_TOTAL_LIMIT)
			amount = SETTINGS_BOARD_HORSE_MOVE_TOTAL_LIMIT - this.horsePositions[which];
		
		// Make and start the tween
		this.horseTween = new TWEEN.Tween(this.horseMeshes[which].position)
		.to(
			{ x: this.horseMeshes[which].position.x + (SETTINGS_BOARD_TILE_SPACING * amount) },
			SETTINGS_BOARD_HORSE_MOVE_TIME
		)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onComplete(
			function () {
				// Only applies to the board instance in index.html
				// Definitely not what's desired in terms of OOP,
				// but it should be okay in the context of this game.
				board.isHorseMoving = false;
			
			}
			
		)
		.start();
	
		this.horsePositions[which] += amount;
		
	}
	
}

Board.prototype.changeBoardState = function(horsePositions) {
	if (this.isHorseMoving == false) {
		this.horsePositions = horsePositions;
		// Animate the horses.
		for (var i = 0; i < this.horseMeshes.length; i++) {
			
			this.horseTweens[i] = new TWEEN.Tween(this.horseMeshes[i].position)
			.to(
				{ x: -SETTINGS_BOARD_MIN_MAX_X + horsePositions[i] * SETTINGS_BOARD_TILE_SPACING },
				SETTINGS_BOARD_HORSE_MOVE_TIME
				
			)
			.easing(TWEEN.Easing.Quadratic.Out)
			.delay(SETTINGS_BOARD_HORSE_MOVE_TIME_DELAY);
			
		}
		
		for (var i = 0; i < this.horseMeshes.length - 1; i++) {
			// Animate the horses.
			this.horseTweens[i].chain(this.horseTweens[i + 1]);
			
		}
		
		this.horseTweens[i].onComplete(function() {
			if (game.currentRound < SETTINGS_GAME_ROUNDS)
				gameStateMachine.changeState(new BetState());
			else
				gameStateMachine.changeState(new GameOverState());
		});
		
		this.horseTweens[0].start();
	}

}

Board.prototype.reset = function() {
	if (this.isHorseMoving == false) {
		for (var i = 0; i < this.horseMeshes.length; i++) {
			// Update horse positions
			this.horsePositions[i] = 0;

			// Animate the horses
			new TWEEN.Tween(this.horseMeshes[i].position)
			.to(
				{ x: -SETTINGS_BOARD_MIN_MAX_X },
				SETTINGS_BOARD_HORSE_MOVE_TIME
				
			)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();
		
		}

	}

}

