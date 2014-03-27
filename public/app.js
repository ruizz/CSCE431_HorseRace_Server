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
    },

    // Set socket ID (session)
    onConnected : function() {
        // Cache a copy of the client's socket.IO session ID on the App
        App.sid = IO.socket.socket.sessionid;
        console.log(data.message);
    },

    onNewGameCreated : function(data) { // data = {game: game, sid: this.id});
        App.Game.gameInit(data);
    },

    updateGameList : function(data){ // data = games
        App.Game.updateGameList(data);
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
    },

    Game : {
        players: {},
        isNewGame : false,
        numPlayers : 0,

        //
        gameInit: function (data){
            App.gid = data.gid;
            App.sid = data.sid;
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
    },

    Player : {
        hid : '', // host ID
        uid : '', // user ID
    }
}

IO.init();
App.init();