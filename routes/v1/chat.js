var express = require('express'),
	router = express.Router(),
	Auth = require('../../model/auth.js'),
	User = require('../../model/user.js'),
	Game = require('../../model/game.js'),
	Error = require('../../model/error.js');

router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	if (!req.query.text) return Error.pipeErrorRender(req, res, Error.invalidParameter);
	if (!req.headers['x-session-token']) return Error.pipeErrorRender(req, res, Error.unauthorized);

	var authQuery = {
			token: req.headers['x-session-token']
		},
		gameQuery = {
			uuid: req.session.gameId
		};
	Auth.pGetOne(authQuery)
		.then(auth => User.pGetOne({}, auth))
		.then(user => Game.pGetOne(gameQuery, user))
		.then(game => Game.pPushChat(game, game.currentUser, req.query.text))
		.then(game => Game.pipeSuccessRender(req, res, game))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;