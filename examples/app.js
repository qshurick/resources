var express = require('express'),
	resources = require('../index.js'),
	app = express();

function logDecorator(middleware, resource) {
	return function() {
		console.log('Do something with the ' + resource.name);
		middleware.apply(null, [].slice.call(arguments));
	}
}

// apply custom decorator for the resource provider and loader
app.set('resource:loader-decorator', logDecorator);
app.set('resource:provider-decorator', logDecorator);

// register resources
app.resource(require('./resources/users.js'));
// register resources
app.resource(require('./resources/tweets.js'));

app.use(function(req, res) {
	res.status(504).end();
})

app.listen(9000);