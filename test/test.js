var Mocha = require('mocha');
var should = require('should');
var assert = require('assert');
var mocha = new Mocha();
var server = require('../server');
var request = require('request');
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

describe('Server.js Tests', function(){
	
	it('Should accept an incoming http connection and respond', function(){
		request.get('http://localhost:8080', function(error, response, body) {
		error.should.not.be.ok;
		response.statsCode.should.eql(200);
		});
	});

});

// Todo
// describe('Horserace.js Tests', function(){

// 	it('Should init the horserace', function(){


// 	});

// 	it('Should tell the client it is connected', function(){

// 	});

// });
