var express = require('express'),
	router = express.Router(),
	User = require('../../model/user.js'),
	Game = require('../../model/game.js'),
	Error = require('../../model/error.js');

router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	if (!req.query.text) return Error.pipeErrorRender(req, res, Error.invalidParameter);
	if (!req.headers['x-session-token']) return Error.pipeErrorRender(req, res, Error.unauthorized);

	var userQuery = {
			token: req.headers['x-session-token']
		},
		gameQuery = {
			uuid: req.session.gameId
		};
	Promise.all([
			User.pGetOne(userQuery),
			Game.pGetOne(gameQuery)
		])
		.then(result => Game.pPushChat(result[1], result[0], req.query.text))
		.then(game => Game.pipeSuccessRender(req, res, game))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;