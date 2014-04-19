// Game class object
var Game = function(gName) {
    this.gameName = gName;
    this.players = {};
    
    this.round = 0;
    //this.gameTime = getTime();
    this.started = false;
    this.horses = new Array(0,0,0,0,0,0,0,0);
    this.moves = generateMoves();
}

module.exports = Game;
// Game.prototype.initializeGame = function(data) {
//  this.gameName = data.gameName;
//  this.players = data.players;

// }

// Game.prototype.updatePlayerList = function(_players) {
//     this.players = _players;
    
// }

function enactRound() {
    //start timer
    //

    //get Bet
    //getBet()

    //end timer
    //

    //move horses
    //

    //emit positions
    //

}

function getBet() {

}

function getTime() {
    var time = (new Date).getTime()
    return time;
}


function timer() {
    var elapsed;
    

}   

function moveHorses() {
    
}

function sendPositions() {


}

// START GAME BOARD GENERATION CODE
// generate moves function returns an 8x10 2D array with all the moves for the horses
function generateMoves() {
    var _ = require('underscore');

    // Generate the first second and third place horses
    var shuffle = _.shuffle(_.range(8));
    var first = shuffle[0];
    var second = shuffle[1];
    var third = shuffle[2];

    var firstPlaceMoves = createPlaceMoves(1);
    var secondPlaceMoves = createPlaceMoves(2);
    var thirdPlaceMoves = createPlaceMoves(3);

    // Create moves array
    var moves = Array()
    for (i in _.range(8)) {
        moves.push(createNonPlaceMoves(3))
    }

    // Swap in winning horse moves
    moves[first] = firstPlaceMoves;
    moves[second] = secondPlaceMoves;
    moves[third] = thirdPlaceMoves;

    // console.log(moves);
    return moves;
}

// Create round move arrays for place positions 1st, 2nd, 3rd
function createPlaceMoves(place) {
    var placeOffset = 7+place;
    var moves = Array.apply(null, new Array(placeOffset)).map(Number.prototype.valueOf,0);
    while (arraySum(moves) != 20) {
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
function createNonPlaceMoves(place) {
    var moves = Array.apply(null, new Array(10)).map(Number.prototype.valueOf,0);
    while (arraySum(moves) != 19) {
        for (i in moves) {
            moves[i] = Math.floor((Math.random()*4));
        }
    }
    return moves;
}

// Returns the sum of values in the array
function arraySum(arr) {
    var total = 0;
    for (i in arr) {
        total += arr[i]
    }
    return total;
}
