var express = require('express'), 
	app     = express.application,
	util    = require('./lib/util.js')
	log4js  = require('log4js'),
	logger  = log4js.getLogger('rest-resource:application');

/**
 * Register new resource as a REST-API Service
 *  usage: 
 * 		- app.resource(resourceDefinition);
 * 		- app.resource(parentResourceDefinition, ..., resourceDefinition);
 * 
 * resourceDefinition: 
 * 		{
 *			name: 'resource', // resource name, used in path, like /resource
 *			alias: 'alias', // alias for context variable, default: name used
 *			id: 'resourceId', // alias for id parameter in camelCase, default: resource name + 'Id'
 *			load: function(id, context) {...}, // function returns Promise with the objects value
 *			index: function(context) {...}, // function, alias for the GET /resource
 *			show: function(context) {...}, // GET /resource/:resourceId. If function load defined object already loaded into the context 
 *			create: function(context) {...}, // POST /resource
 *			update: function(context) {...}, // PUT /resource/:resourceId
 *			destroy: function(context) {...}, // DELETE /resource/:resourceId
 *			links: {}, // alised list of the linked resource: alias: resourceDefinition
 *			attributes: {}, // named list of the resource attributes: name: attributeDefinition
 * 		}
 * 
 */
app.resource = function() {
	var args = [].slice.call(arguments),
		app = this,
		path = util.path.apply(null, args);

	var resource = util.inherit.apply(null, args);

	resource.parentProvider(app); // register global handlers

	app.use(path, util.Router(resource, app));

	logger.debug('Resource \'%s\' mounted at \'%s\'', resource.name, path);

	if (args.length == 1) {
		var resource = args.shift();
		if (!!resource.links) {
			Object.keys(resource.links).forEach(function(subResourceName) {
				app.resource(resource, resource.links[subResourceName]);
			})
		}
	}
}
