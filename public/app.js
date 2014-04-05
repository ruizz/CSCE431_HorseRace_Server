var ioSocket = io.connect();


// Binding events
ioSocket.on('connected', onConnected);
ioSocket.on('newGameCreated', onNewGameCreated );
ioSocket.on('updateGameList', updateGameList );

//TODO
// ioSocket.on('gameJoined', IO.onGameJoined );
ioSocket.on('showError', showError );

function onConnected() {
    // Cache a copy of the client's socket.IO session ID on the App
    App.sid = ioSocket.socket.sessionid;
    // console.log(data.message);
    
}

function updateGameList() {
    App.Game.updateGameList(games);
}

function showError(data) {
    console.log('err: ' + data);
    alert(data);
}

var App = {
    gid: 0, // game ID
    sid: '', // socket ID
    role: '', // either player or server
    round: 0,

    init : function() {
        App.cacheElements();
        App.bindEvents();
    },

    cacheElements : function() {
        App.$doc = $(document);
    },

    bindEvents: function() {
        App.$doc.on('click', '#btnCreateGame', App.Game.onCreateClick);
        App.$doc.on('click', '#btnJoinGame', App.Game.onJoinClick);
    },

    Game : {
        players: {},
        isNewGame : false,
        numPlayers : 0,

        //
        gameInit: function (game){
            App.gid = data.gid;
        },

        //TODO
        gameJoin: function (data){

        },

        updateGameList: function(games) {
            console.log('Num Games:' + Object.keys(games).length);
            for (var key in games){
                console.log('ccc: ' + games[key]['gameName']);
            }
            
        },

        onCreateClick: function() {
                var gameName = $(txtCreateGame).val()
                //TODO: check gameName is undefined

                console.log('Game name: ' + gameName);
                console.log('Clicked "Create a game"');

                ioSocket.emit('createNewGame', gameName);
        },

        onJoinClick: function() {
                var gameName = $(txtJoinGame).val()
                //TODO: check gameName is undefined

                console.log('Game name: ' + gameName);
                console.log('Clicked "Join a game"');

                ioSocket.emit('joinGame', gameName);
        },
    },

    Player : {
        hid : '', // host ID
        uid : '', // user ID
    }
}

App.init();