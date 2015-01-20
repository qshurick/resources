var express = require('express'), globalParamsLoaded = [];

// call: combineResource(parent1, parent2, parent3, ..., child)
// to get URL: /parent1/:parent1Id/parent2/:.../child
function combineResource() {
	var parents = [].slice.call(arguments);
	var resource = parents.pop();
	resource.parentProvider = function(app) {
		parents.forEach(function(parent, index) {
			if (globalParamsLoaded.indexOf(parent.id) != -1) return;
			globalParamsLoaded.push(parent.id);
			logger.debug('Mounting global loader fo parameter \'%s\'', parent.id);
			var decorator = app.get('resource:loader-decorator');
			if (typeof decorator == 'function') {
				app.param(parent.id, decorator(parent.load, parent));
			} else {
				app.param(parent.id, parent.load);
			}
		})
	}
	return resource;
}

// call: getPath(parent1, parent2, parent3, ..., child)
// to get URL: /parent1/:parent1Id/parent2/:.../child
function getPath() {
	var parents = [].slice.call(arguments);
	var resource = parents.pop();
	var path = [];
	parents.forEach(function(parent, index) {
		path.push(parent.name);
		path.push(':' + parent.id);
	})
	
	return (path.length > 0 ? '/' + path.join('/') : '' )+ '/' + resource.name;
}

function map(method) {
	return ({
		'index':   'get',
		'show':    'get',
		'create':  'post',
		'update':  'put',
		'destroy': 'delete',
		'options': 'options',
	})[method];
}

function defaultOptionsMiddleware(allow) {
	return function(req, res, next) {
		res.set('Allow', allow);
		res.status(200).end();
	}
}

// converter: resource to express.Router
function toRouter(resource, app) {
	
	var router = express.Router(), list = [], item = [];

	if (typeof app != 'function')
		app = { get: function(){} };

	if (typeof resource.load == 'function') {
		var decorator = app.get('resource:loader-decorator');
		if (typeof decorator == 'function') {
			router.param(resource.id, decorator(resource.load, resource));
		} else {
			router.param(resource.id, resource.load);
		}
	}
	
	['index', 'create'].forEach(function(method) {
		if (typeof resource[method] == 'function') {
			list.push(map(method).toUpperCase());
			var decorator = app.get('resource:provider-decorator');
			if (typeof decorator == 'function') {
				router[map(method)]('/', decorator(resource[method], resource));
			} else {
				router[map(method)]('/', resource[method]);
			}
		}
	});

	['show', 'update', 'destroy'].forEach(function(method) {
		if (typeof resource[method] == 'function') {
			item.push(map(method).toUpperCase());
			var decorator = app.get('resource:provider-decorator');
			if (typeof decorator == 'function') {
				router[map(method)]('/:' + resource.id, decorator(resource[method], resource));
			} else {
				router[map(method)]('/:' + resource.id, resource[method]);
			}
		}
	});

	var optionFn = typeof resource.options == 'function' ? resource.options : defaultOptionsMiddleware(resource);

	var decorator = app.get('resource:provider-decorator');
	if (typeof decorator == 'function') {
		router.options('/', decorator(optionFn, resource));
		router.options('/:' + resource.id, decorator(optionFn, resource));
	} else {
		router.options('/', optionFn);
		router.options('/:' + resource.id, optionFn);
	}


	return router;
}

exports.Router  = toRouter;
exports.path    = getPath;
exports.inherit = combineResource;
