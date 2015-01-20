var users = [
	{ id: 1, name: 'David Blane', email: 'davidblane@magic.com' },
	{ id: 2, name: 'Bruce Wayne', email: 'batman@ghotam.city' }
];

exports.name = 'users';
exports.id   = 'userId';
exports.load = function(req, res, next, value) {
	if (users[value - 1] != undefined) {
		res.locals.user = users[value - 1];
		next();
	} else {
		res.status(404).end();
	}
}
exports.index = function(req, res, next) {
	res.json(users);
}
exports.show = function(req, res, next) {
	res.json(res.locals.user);
}
exports.attributes = {
	id: {
		description: 'User\'s id'
	},
	name: {
		description: 'Valid user name'
	},
	email: {
		description: 'Email'
	}
}
exports.links = {
	tweets: require('./tweets.js')
}