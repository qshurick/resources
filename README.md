# resources
Express 4 extention to creation a REST API

```js
var express = require('express'),
var resources = require('@qshurick/resources'),
var app = express();

app.resource(users);

app.listen(9000);
```

## Define resource

**Properties**

  * ```name``` — resource name
  * ```id``` - resource parameter alias, that define resource id
  * ```links``` — a JSON objects with the resource aliases as a keys and resource definitions as a value. 
  For each resource will be created a Router for a path ```/parentResource/:parentResourceId/childResource```. 
  For this Router will be mounted all resource providers (check the Methods section)

Add any new properties if needed.

**Methods**

All method could be wrapped with the decoration functions. Check the Decoration section.

  * ```load``` — function used as a middleware to app.param(resource.id, middleware)
  * ```index``` — middleware for the path: ```GET /resource```
  * ```show``` — middleware for the path: ```GET /resource/:id```
  * ```create```  — middleware for the path: ```POST /resource```
  * ```update``` — middleware for the path: ```PUT /resource/:id```
  * ```destroy``` — middleware for the path: ```DELETE /resource/:id```
  
## Decorators

Resources use two express' parameters: ```resource:loader-decorator``` and ```resource:provider-decorator```.
Each parameter could be a function, that takes two parameters: resource's provider or loader (see Methods) and 
resource itself and must return a valid middleware, that will used instead of resource's provider.
It can be used to change resources behavior and separate it from the express framework logic.

```js
app.set('resource:loader-decorator', function(loader, resource) {
  return function(req, res, next, value) {
    loader(value, function(err, object) {
      if (err) return next(new Error(err));
      req[resource.id] = object;
      next();
    });
  }
});
```
