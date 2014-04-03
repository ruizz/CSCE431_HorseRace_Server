var IO = {
    // This called when the page is loaded. Connect to the socket.
    init : function() {
        IO.socket = io.connect(),
        IO.bindEvents();
    },

    bindEvents : function() {
        IO.socket.on('connected', App.onConnected);
        IO.socket.on('newGameCreated', IO.onNewGameCreated );
        IO.socket.on('updateGameList', IO.updateGameList );

        //TODO
        // IO.socket.on('gameJoined', IO.onGameJoined );
        IO.socket.on('showError', IO.showError );
    },

    // Set socket ID (session)
    onConnected : function() {
        // Cache a copy of the client's socket.IO session ID on the App
        App.sid = IO.socket.socket.sessionid;
        // console.log(data.message);
    },

    onNewGameCreated : function(game) {
        // App.Game.gameInit(data);
    },

    updateGameList : function(games){ // data = games
        App.Game.updateGameList(games);
    },

    showError : function(data) {
        console.log('err: ' + data);
        alert(data);
    }
};

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

                IO.socket.emit('createNewGame', gameName);
        },

        onJoinClick: function() {
                var gameName = $(txtJoinGame).val()
                //TODO: check gameName is undefined

                console.log('Game name: ' + gameName);
                console.log('Clicked "Join a game"');

                IO.socket.emit('joinGame', gameName);
        },
    },

    Player : {
        hid : '', // host ID
        uid : '', // user ID
    }
}

IO.init();
App.init();