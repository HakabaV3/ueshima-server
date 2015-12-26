var express = require('express'),
	router = express.Router(),
	User = require('../../model/user.js'),
	Game = require('../../model/game.js'),
	Error = require('../../model/error.js');

router.get('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var userQuery = {
			token: req.headers['x-session-token']
		},
		gameOption = {
			sort: {
				updated: 'desc'
			}
		};
	User.pGetOne(userQuery)
		.then(user => Game.pGet(user, gameOption))
		.then(games => Game.pipeSuccessRenderAll(req, res, games))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	if (!req.headers['x-session-token']) return Error.pipeErrorRender(req, res, Error.invalidParameter);
	if (!req.query.name) return Error.pipeErrorRender(req, res, Error.invalidParameter);

	var userQuery = {
			token: req.headers['x-session-token']
		},
		playerQuery = {
			name: req.query.name
		};
	Promise.all([
			User.pGetOne(userQuery),
			User.pGetOne(playerQuery)
		]).then(users => Game.pCreate(users))
		.then(game => Game.pipeSuccessRender(req, res, game))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

router.post('/:gameId/invitation', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	if (!req.headers['x-session-token']) return Error.pipeErrorRender(req, res, Error.invalidParameter);
	if (!req.query.name) return Error.pipeErrorRender(req, res, Error.invalidParameter);

	var userQuery = {
			token: req.headers['x-session-token']
		},
		gameQuery = {
			uuid: req.params.gameId
		};
	User.pGetOne(userQuery)
		.then(user => Game.pGetOne(gameQuery, user))
		.then(game => Game.pPushGuest(game, req.query.name))
		.then(game => Game.pipeSuccessRender(req, res, game))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;