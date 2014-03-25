var IO = {
    // This called when the page is loaded. Connect to the socket.
    init : function() {
        IO.socket = io.connect(),
        IO.bindEvents();
    },

    bindEvents : function() {
        IO.socket.on('connected', App.onConnected);
    },

    // Get socket ID (session)
    onConnected : function() {
        // Cache a copy of the client's socket.IO session ID on the App
        App.sid = IO.socket.socket.sessionid;
        console.log(data.message);
    }
};

var App = {
    gid: 0, // game ID
    sid: '', // socket ID
    role: '', // either player or server
    round: 0,

    init : function() {
        App.bindEvents();
    },

    bindEvents: function() {
        // App.$doc.on('click', '#btnCreateGame', App.Host.onCreateClick);
    },

    Host : {
        players: {},
        isNewGame : false,
        numPlayers : 0,

        gameInit: function (data){
            App.gid = data.gid;
            App.sid = data.sid;
            App.role = 'Host';
            App.numPlayers = 0;
        },

        onCreateClick: function () {
                // console.log('Clicked "Create a game"');
                IO.socket.emit('hostCreateNewGame');
        },
    },

    Player : {
        hid : '', // host ID
        uid : '', // user ID
    }
}

IO.init();
App.init();

// function Game() {
// 	// this.id; coupon-code
// 	this.turn = 0;
// 	this.timer = 0;
// 	this.moves = createArray(8,10);
//     // console.log(this.moves.length);
//     // console.log(this.moves[0].length);
//     generateRandomNumbers();
// }

// Game.prototype.generateRandomNumbers = function() {
//     var row = this.moves.length;
//     var col = this.moves[0].length;

//     for (var i = 0; i < row; i++){
//         for (var j= 0; j < col; j++){
//             this.moves[i][j] = 1;
//         }
//     }
// };

// How can I create a two dimensional array in JavaScript?
// http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
// Usage: createArray(8, 10);
// Game.prototype.createArray = function createArray(length) {
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}


/*
TODO:
- int id
- int turn
- double multipliers[]
- User users[]
- int bats[]
- double timer
- moves[][][] // pre-generated moves of horses (by turn)
*/