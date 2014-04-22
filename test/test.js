var Mocha = require('mocha');
var should = require('should');
var assert = require('assert');
var mocha = new Mocha();
var server = require('../server');
var request = require('request');
var game = require('../game');
var horserace = require('../horserace');
var socketio = require('socket.io');

mocha.reporter('dot');

var runner = mocha.run(function(){} );

describe('Test Mocha', function(){
	describe('#indexOf()', function(){
		it('should return -1 when the value is not present', function(){
			[1,2,3].indexOf(5).should.equal(-1);
			[1,2,3].indexOf(0).should.equal(-1);

		});
	});
});

describe('game.js Tests', function() {
	describe('game', function() {
		var sio = socketio.listen(5000);
		var testGame = new game("test", sio);

		it("should be a game named test", function() {			
			testGame.gameName.should.equal('test');
		});

		it("should be totalbets equal to 10", function() {
			testGame.horseBetValues = [1,1,1,1,1,1,1,3];
			testGame.updateTotal();
			testGame.totalBets.should.equal(10);
		});
	});

	describe('game2', function() {
		var sio = socketio.listen(5000);
		var testGame = new game("test", sio);
		testGame.players = {
							    "devan" :12345,
							    "ruiz" : 12345,
							    "zach" : 12345,
							    "eliott" : 12345
							};
		testGame.totalBets = 95;
		testGame.horseBetValues = [11,25,13,4,7,11,14,10];
		testGame.userMoney = {
		    "devan" : [0,18,0,0,0,1,4,1],
		    "ruiz" : [1,4,3,3,4,3,3,3],
		    "zach" : [6,1,7,1,2,2,3,2],
		    "eliott" : [4,2,3,0,1,5,4,4]
		}
		testGame.winningHorses = [2,3,7];

		it("calculate winnings function", function() {			
			testGame.calculateWinnings().should.containEql({ devan: '3.17', ruiz: '40.56', zach: '31.30', eliott: '19.97' });
		});

		it("game moves", function() {			
			testGame.generateMoves().should.have.length(8);
			testGame.moves.should.have.length(8);
		});


	});
});

describe('Horserace.js Tests', function(){
	var sio = socketio.listen(5000);
	var hr = null;

	it('Should init the horserace', function(){
		sio.sockets.on('connection', function (socket) {
	    	hr = horserace.init(sio, socket);
		});
	});

	it('Should tell the client it is connected', function(){

	});

});


describe('Server.js Tests', function(){
	
	it('Should accept an incoming http connection and respond', function(){
		request.get('http://localhost:8080', function(error, response, body) {
		error.should.not.be.ok;
		response.statsCode.should.eql(200);
		});
	});

});


