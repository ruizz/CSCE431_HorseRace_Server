// Game class object
var Game = function(gName, sio) {
    this.io = sio;
    this.gameName = gName;
    this.players = {};
    this.round = 0;
    this.gameTime = this.getNewTime();
    this.targetTime = 0;
    this.intervalID;
    this.started = false;
    this.horses = new Array(0,0,0,0,0,0,0,0);
    this.moves = this.generateMoves();
    this.enactRound();
    this.gameOver();
}

module.exports = Game;

Game.prototype.enactRound = function() {
    //start timer
    this.setTimer(this.getNewTime(),5000);
    this.intervalID = setInterval(this.checkTimer.bind(this),1000);

    
    //get Bet
    //getBet()

    //end timer
    //
    
    //console.log(this.moves);
    //move horses
    //

    //emit positions
    //

}

//Called once all rounds have finished
Game.prototype.gameOver = function() {
    //Clean up anything that needs it

    //Disperse Winnings to players

}

//Get bets from client and send to bank
Game.prototype.getBet = function() {

}

//For some reason I decided to wrap the current time function
Game.prototype.getNewTime = function() {
    var time = (new Date).getTime();
    return time;
}

//Timer function, if it has two args it sets timer, 
//If it has one arg, it checks the timer.
Game.prototype.setTimer = function(currentTime, duration) {
    //Make new timer
    this.targetTime = currentTime + duration;
}


Game.prototype.checkTimer = function() {
    if ((new Date).getTime() >= this.targetTime) {
        //Tell the client to start animating after the betting is over
        this.io.sockets.in(this.gameName).emit('animateBoard');
        //Clear the repeating timer check
        clearInterval(this.intervalID);
        this.moveHorses();
    }
}

//Move horses to their new positions
Game.prototype.moveHorses = function() {
    for(var i = 0; i < 8; i++) {
        this.horses[i] += this.moves[i][this.round];
    }
    // console.log(this.horses);
    this.sendPositions();

}

//Emit to tell clients to move to new positions
Game.prototype.sendPositions = function() {
    //Pass array to client of update horse positions
    this.io.sockets.in(this.gameName).emit('updateHorsePositions', this.horses);
    // Increment Round count
    this.round++;

}

// START GAME BOARD GENERATION CODE
// generate moves function returns an 8x10 2D array with all the moves for the horses
Game.prototype.generateMoves = function() {
    var _ = require('underscore');

    // Generate the first second and third place horses
    var shuffle = _.shuffle(_.range(8));
    var first = shuffle[0];
    var second = shuffle[1];
    var third = shuffle[2];

    var firstPlaceMoves = this.createPlaceMoves(1);
    var secondPlaceMoves = this.createPlaceMoves(2);
    var thirdPlaceMoves = this.createPlaceMoves(3);

    // Create moves array
    var moves = Array()
    for (i in _.range(8)) {
        moves.push(this.createNonPlaceMoves(3))
    }

    // Swap in winning horse moves
    moves[first] = firstPlaceMoves;
    moves[second] = secondPlaceMoves;
    moves[third] = thirdPlaceMoves;

    // console.log(moves);
    return moves;
}

// Create round move arrays for place positions 1st, 2nd, 3rd
Game.prototype.createPlaceMoves = function(place) {
    var placeOffset = 7+place;
    var moves = Array.apply(null, new Array(placeOffset)).map(Number.prototype.valueOf,0);
    while (this.arraySum(moves) != 20) {
        for (i in moves) {
            moves[i] = Math.floor((Math.random()*4));
        }
        // I can add more rules here
        // i.e. at least 2 zero move rounds
    }
    while(moves.length != 10) {
        moves.push(0);
    }
    return moves;
}

// Create round move array for the rest, should not be at end on 10th round
Game.prototype.createNonPlaceMoves = function(place) {
    var moves = Array.apply(null, new Array(10)).map(Number.prototype.valueOf,0);
    while (this.arraySum(moves) != 19) {
        for (i in moves) {
            moves[i] = Math.floor((Math.random()*4));
        }
    }
    return moves;
}

// Returns the sum of values in the array
Game.prototype.arraySum = function(arr) {
    var total = 0;
    for (i in arr) {
        total += arr[i]
    }
    return total;
}
