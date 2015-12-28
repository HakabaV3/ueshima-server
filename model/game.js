var mongoose = require('./db.js'),
	schema = require('../schema/game.js'),
	AuthHelper = require('../helper/auth.js'),
	GameHelper = require('../helper/game.js'),
	Error = require('./error.js');

var _ = {},
	model = mongoose.model('Game', schema),
	moveModel = mongoose.model('Move', require('../schema/move.js'));

_.pGet = function(user, option) {
	console.log('Game.pGet');
	console.log(user);
	var query = {
		$or: [{
			players: user.name
		}, {
			guests: user.name
		}],
		deleted: false
	};
	option = option || {
		sort: {
			updated: 'desc'
		}
	};
	return new Promise(function(resolve, reject) {
		model.find(query, {}, option, function(err, games) {
			if (err) return reject(Error.mongoose(500, err));

			resolve(games);
		});
	});
};

_.pGetOne = function(query, user) {
	console.log('Game.pGetOne');
	if (user) {
		query.$or = [{
			players: user.name
		}, {
			guests: user.name
		}];
	}

	return new Promise(function(resolve, reject) {
		model.findOne(query, function(err, game) {
			console.log(game);
			if (err) return reject(Error.mongoose(500, err));
			if (!game) return reject(Error.invalidParameter);

			resolve(game);
		});
	});
};

_.pCreate = function(users) {
	console.log('Game.pCreate');
	console.log(users.map(user => user.name));
	var query = {
		turn: users[0].name,
		players: users.map(user => user.name)
	};
	console.log(query);
	return new Promise(function(resolve, reject) {
		new model(query)
			.save(function(err, createdGame) {
				if (err) return reject(Error.mongoose(500, err));
				if (!createdGame) return reject(Error.invalidParameter);

				return resolve(createdGame);
			});
	});
};

_.pipeSuccessRender = function(req, res, game) {
	console.log('Game.pipeSuccessRender\n');
	game.board = _filterBoardByPlatform(req.headers['x-platform'], game);
	var gameObj = {
		id: game.uuid,
		players: game.players,
		guests: game.guests,
		turn: game.turn,
		moves: game.moves.map(function(move) {
			return {
				x: move.x,
				y: move.y,
				player: move.player,
				playerId: move.playerId,
				created: move.created
			}
		}),
		board: game.board,
		chats: game.chats.map(function(chat) {
			return {
				player: chat.player,
				playerId: chat.playerId,
				text: chat.text,
				created: chat.created
			}
		}),
		created: game.created,
		updated: game.updated
	};
	return res.ok(200, {
		game: gameObj
	});
};

_.pipeSuccessRenderAll = function(req, res, games) {
	console.log('Game.pipeSuccessRendeAll\n');
	return res.ok(200, {
		games: games.map(function(game) {
			game.board = _filterBoardByPlatform(req.headers['x-platform'], game);
			return {
				id: game.uuid,
				players: game.players,
				guests: game.guests,
				turn: game.turn,
				moves: game.moves.map(function(move) {
					return {
						x: move.x,
						y: move.y,
						player: move.player,
						playerId: move.playerId,
						created: move.created
					}
				}),
				board: game.board,
				chats: game.chats,
				created: game.created,
				updated: game.updated
			};
		})
	});
};

_.pPutMove = function(px, py, game) {
	console.log('Game.pPutMove');
	return new Promise(function(resolve, reject) {
		console.log(`${game}\n${AuthHelper.currentUser}`);
		if (game.turn !== AuthHelper.currentUser.name) return reject(Error.invalidPlayer(AuthHelper.currentUser.name));
		console.log('Game.pPutMove');
		if (!GameHelper.checkIsPuttable(px, py, game.board, game.players, AuthHelper.currentUser.name)) return reject(Error.invalidMove(px, py));

		console.log('Game.pPutMove');
		var enemyName = game.players[0] === AuthHelper.currentUser.name ? game.players[1] : game.players[0],
			board = GameHelper.putMove(px, py, game.board, game.players, AuthHelper.currentUser.name),
			turn = GameHelper.checkIsEnablePlayerToPut(board, game.players, enemyName) ? enemyName : AuthHelper.currentUser.name,
			gameQuery = {
				uuid: game.uuid
			},
			move = new moveModel({
				x: px,
				y: py,
				gameId: game.uuid,
				playerId: AuthHelper.currentUser.uuid,
				player: AuthHelper.currentUser.name,
				created: parseInt(Date.now() / 1000),
				updated: parseInt(Date.now() / 1000)
			});
		console.log('Game.pPutMove');
		model.findOneAndUpdate(gameQuery, {
			turn: turn,
			board: board,
			$push: {
				moves: move
			}
		}, {
			safe: true,
			new: true
		}, function(err, updatedGame) {
			console.log('Game.pPutMove');
			if (err) return reject(Error.mongoose(500, err));
			if (!updatedGame) return reject(Error.invalidParameter);
			console.log('Game.pPutMove');

			resolve(updatedGame);
		});
	});
};

_.pPushChat = function(gameObj, text) {
	console.log('Game.pPushChat');
	gameObj.chats.push({
		gameId: gameObj.uuid,
		player: AuthHelper.currentUser.name,
		playerId: AuthHelper.currentUser.uuid,
		text: text,
		created: parseInt(Date.now() / 1000)
	});
	return new Promise(function(resolve, reject) {
		var gameQuery = {
				uuid: gameObj.uuid,
				$or: [{
					players: AuthHelper.currentUser.name
				}, {
					guests: AuthHelper.currentUser.name
				}]
			},
			chatQuery = gameObj.chats[gameObj.chats.length - 1];

		model.findOneAndUpdate(gameQuery, {
			$push: {
				chats: chatQuery
			}
		}, {
			safe: true,
			new: true
		}, function(err, updatedGame) {
			if (err) return reject(Error.mongoose(500, err));
			if (!updatedGame) return reject(Error.invalidParameter);

			resolve(updatedGame);
		});
	});
};

_.pPushGuest = function(gameObj, guestName) {
	console.log('Game.pPushGeust');
	return new Promise(function(resolve, reject) {
		gameObj.guests.push(guestName);
		gameObj.save(function(err, updatedGame) {
			if (err) return reject(Error.mongoose(500, err));
			if (!updatedGame) return reject(Error.invalidParameter);

			resolve(updatedGame);
		});
	});
};

function _filterBoardByPlatform(platform, game) {
	if (platform == 'ios') {
		var move = GameHelper.lastMove(game);
		if (move) game.board[move.y * 10 + move.x] = 11 * GameHelper.colorOfMove(game, move);
		game.board = GameHelper.addPuttablePointsToBoard(game.board, game.players, AuthHelper.currentUser.name);
	}
	console.log(platform);
	return game.board;
}

module.exports = _;