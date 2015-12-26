var express = require('express'),
	router = express.Router(),
	ObjectId = require('mongoose').Types.ObjectId,
	User = require('../../model/user.js'),
	Game = require('../../model/game.js'),
	Error = require('../../model/error.js');

router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	if (!req.query.x) return Error.pipeErrorRender(req, res, Error.invalidParameter);
	if (!req.query.y) return Error.pipeErrorRender(req, res, Error.invalidParameter);
	if (!req.headers['x-session-token']) return Error.pipeErrorRender(req, res, Error.unauthorized);

	var userQuery = {
			token: req.headers['x-session-token']
		},
		gameQuery = {
			uuid: req.session.gameId
		},
		x = parseInt(req.query.x),
		y = parseInt(req.query.y);

	Promise.all([
			User.pGetOne(userQuery),
			Game.pGetOne(gameQuery)
		])
		.then(result => Game.pPutMove(x, y, result[1], result[0]))
		.then(game => Game.pipeSuccessRender(req, res, game))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;