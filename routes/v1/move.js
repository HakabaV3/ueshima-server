var express = require('express'),
	router = express.Router(),
	Auth = require('../../model/auth.js'),
	User = require('../../model/user.js'),
	Game = require('../../model/game.js'),
	Error = require('../../model/error.js');

router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	if (!req.query.x) return Error.pipeErrorRender(req, res, Error.invalidParameter);
	if (!req.query.y) return Error.pipeErrorRender(req, res, Error.invalidParameter);
	if (!req.headers['x-session-token']) return Error.pipeErrorRender(req, res, Error.unauthorized);

	var authQuery = {
			token: req.headers['x-session-token']
		},
		gameQuery = {
			uuid: req.session.gameId
		},
		x = parseInt(req.query.x),
		y = parseInt(req.query.y);

	Auth.pGetOne(authQuery)
		.then(auth => User.pGetOne({}, auth))
		.then(user => Game.pGetOne(gameQuery, user))
		.then(game => Game.pPutMove(x, y, game, game.currentUser))
		.then(game => Game.pipeSuccessRender(req, res, game))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;