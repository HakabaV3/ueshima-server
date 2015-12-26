var express = require('express'),
	router = express.Router(),
	Auth = require('../../model/auth.js'),
	User = require('../../model/user.js'),
	Error = require('../../model/error.js');

/*
 * @header
 * token String
 */
router.get('/me', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	if (!req.headers['x-session-token']) return Error.pipeErrorRender(req, res, Error.unauthorized);

	var authQuery = {
			token: req.headers['x-session-token']
		},
		userQuery = {
			deleted: false
		};
	Auth.pGetOne(authQuery)
		.then(auth => Auth.pCreate(auth.userId))
		.then(auth => User.pGetOne(userQuery, auth))
		.then(user => User.pipeSuccessRender(req, res, user))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * @body
 * userName String
 * password String
 */
router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.baseUrl}`);
	Auth.pSignIn(req.query.name, req.query.password)
		.then(user => Auth.pCreate(user.uuid, user))
		.then(user => User.pipeSuccessRender(req, res, user))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * @header
 * token String
 */
router.delete('/', function(req, res, next) {
	console.log(`[${req.method}] ${req.baseUrl}`);
	if (!req.headers['x-session-token']) return Error.pipeErrorRender(req, res, Error.unauthorized);

	var query = {
		token: req.headers['x-session-token']
	};
	Auth.pGetOne(query)
		.then(auth => Auth.pRemove(auth.userId))
		.then(() => res.ok(201, {}))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;