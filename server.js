// Call necessary files - Just like #include in C++
var express = require('express'),
    app = express(),
    http = require('http'),
    socketio = require('socket.io')
    path = require('path'),
    horserace = require('./horserace');

// Default path configuration
app.configure(function() {
    app.use(express.static(path.join(__dirname,'public')));
});

// Create server    
var server = http.createServer(app).listen(8080);
var io = socketio.listen(server);

// To not show trivial logs such as keepalives
io.set('log level' ,1);

io.sockets.on('connection', function (socket) {
    console.log('server.js - io.sockets.on(), client connected');
    horserace.init(io, socket);
});
