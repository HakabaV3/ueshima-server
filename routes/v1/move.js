var express = require('express'),
	router = express.Router(),
	ObjectId = require('mongoose').Types.ObjectId,
	User = require('../../model/user.js'),
	Game = require('../../model/game.js'),
	Error = require('../../model/error.js');

function _generateObjectId(objectId) {
	try {
		return ObjectId = new ObjectId(objectId);
	} catch (err) {
		return res.ng(500, {
			error: {
				messgae: 'INVALID_PARAMETER'
			}
		});
	}
}

router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	if (!req.query.x) return Error.pipeErrorRender(req, res, Error.invalidParameter);
	if (!req.query.y) return Error.pipeErrorRender(req, res, Error.invalidParameter);
	if (!req.headers['x-session-token']) return Error.pipeErrorRender(req, res, Error.invalidParameter);

	var unixNow = parseInt(Date.now() / 1000),
		userQuery = {
			token: req.headers['x-session-token']
		},
		gameQuery = {
			uuid: req.session.gameId
		},
		moveQuery = {
			x: parseInt(req.query.x),
			y: parseInt(req.query.y),
			gameId: req.session.gameId,
			created: unixNow,
			updated: unixNow
		};
	Promise.all([
			User.pGetOne(userQuery),
			Game.pGetOne(gameQuery)
		]).then(result => Game.pPush(gameQuery, moveQuery, result[0], result[1]))
		.then(game => Game.pipeSuccessRender(req, res, game))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;