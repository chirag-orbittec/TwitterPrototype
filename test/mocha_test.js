/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should return the login if the url is correct', function(done){
		http.get('http://localhost:3000/login', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('should login', function(done) {
		request.post(
			    'http://localhost:3000/checklogin',
			    { form: { username: 'demo',password:'demo' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('should not login', function(done) {
		request.post(
			    'http://localhost:3000/checklogin',
			    { form: { username: 'demo',password:'demo1' } },
			    function (error, response, body) {
			    	assert.equal(body.includes("201"),true);
			    	done();
			    }
			);
	  });
	
	it('should search by hashtag', function(done) {
		request.post(
			    'http://localhost:3000/searchHash',
			    { form: { searchInput: '#cmpe273' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('should logout from system', function(done){
		http.get('http://localhost:3000/logout', function(res) {
			assert.equal(null, http.session);
			done();
		})
	});
});