var express = require('express'),
	router = express.Router(),
	userRouter = require('./v1/user'),
	gameRouter = require('./v1/game'),
	moveRouter = require('./v1/move');

express.response.ok = function(code, result) {
	return this.json({
		status: code,
		result: result || {}
	});
};

express.response.ng = function(code, result) {
	return this.json({
		status: code,
		result: result || {}
	});
};

router.use(function(req, res, next) {
	req.session = {};
	res.set({
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'X-Session-Token,Content-Type',
		'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE'
	});
	next();
});

router.use('/user', userRouter);
router.use('/game', gameRouter);
router.use('/game/:gameId/move', [
	function(req, res, next) {
		req.session.gameId = req.params.gameId;
		next();
	},
	moveRouter
]);

module.exports = router;