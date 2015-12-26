var express = require('express'),
	router = express.Router(),
	Auth = require('../../model/auth.js'),
	User = require('../../model/user.js'),
	Error = require('../../model/error.js');

router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var userQuery = {
		name: req.query.name
	};
	if (req.query.password) userQuery.password = req.query.password;

	User.pCreate(userQuery)
		.then(user => Auth.pCreate(user.uuid, user))
		.then(user => User.pipeSuccessRender(req, res, user))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;