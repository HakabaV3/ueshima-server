var express = require('express'),
	router = express.Router(),
	User = require('../../model/user.js'),
	Error = require('../../model/error.js');

router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	console.log(req.query);
	var userQuery = {
		name: req.query.name
	};
	User.pCreate(userQuery)
		.then(user => User.pipeSuccessRender(req, res, user))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;