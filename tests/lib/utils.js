var util   = require('../../lib/util.js'),
	assert = require('assert');

describe('Check resources core', function() {
	
	it ('Should return a path for the resource', function(){
		assert.equal(util.path({name:'users'}), '/users');
	})
	
	it ('Should return a path for few mounted resources', function(){
		assert.equal(util.path(
			{ name: 'users', id: 'userId' },
			{ name: 'tweets' }
		), '/users/:userId/tweets');
	})

});