var mongoose = require('./db.js'),
	schema = require('../schema/game.js'),
	Error = require('./error.js');

var _ = {},
	model = mongoose.model('Game', schema);

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
	if (user) query.players = user.name;
	console.log(query);

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

_.pPush = function(gameObj) {
	console.log('Game.pPush');

	var gameQuery = {
			uuid: gameObj.uuid
		},
		moveQuery = gameObj.moves[gameObj.moves.length - 1];

	return new Promise(function(resolve, reject) {
		model.findOneAndUpdate(gameQuery, {
			turn: gameObj.turn,
			board: gameObj.board,
			$push: {
				moves: moveQuery
			}
		}, {
			safe: true,
			upsert: true,
			new: true
		}, function(err, updatedGame) {
			if (err) return reject(Error.mongoose(500, err));
			if (!updatedGame) return reject(Error.invalidParameter);

			resolve(updatedGame);
		});
	});
};

_.pipeSuccessRender = function(req, res, game) {
	console.log('Game.pipeSuccessRender\n');
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

/*-----------------------------------------------------------------------
 * About handling game
 */
const CellType = {
	BLACK: -1,
	EMPTY: 0,
	WHITE: 1,
};

const DIR = [
	[0, -1],
	[1, -1],
	[1, 0],
	[1, 1],
	[0, 1],
	[-1, 1],
	[-1, 0],
	[-1, -1]
];

function _checkIsPuttable(px, py, board, players, playerName) {
	const ME = players[0] === playerName ? CellType.BLACK : CellType.WHITE;
	const ENEMY = ME == CellType.BLACK ? CellType.WHITE : CellType.BLACK;

	if (board[py * 10 + px] !== CellType.EMPTY) return false;
	for (var d = 0; d < DIR.length; d++) {
		var x = px + DIR[d][0],
			y = py + DIR[d][1];

		if (board[y * 10 + x] !== ENEMY) continue;

		while (true) {
			x += DIR[d][0];
			y += DIR[d][1];

			if (board[y * 10 + x] === CellType.EMPTY) {
				break;
			} else if (board[y * 10 + x] === ME) {
				return true
			}
		}
	}
	return false;
}

function _putMove(px, py, board, players, playerName) {
	const ME = players[0] === playerName ? CellType.BLACK : CellType.WHITE;
	const ENEMY = ME === CellType.BLACK ? CellType.WHITE : CellType.BLACK;

	board[py * 10 + px] = ME;

	for (var d = 0; d < DIR.length; d++) {
		var x = px + DIR[d][0],
			y = py + DIR[d][1];

		if (board[y * 10 + x] !== ENEMY) continue;

		while (true) {
			x += DIR[d][0];
			y += DIR[d][1];

			if (board[y * 10 + x] === CellType.EMPTY) {
				break;
			} else if (board[y * 10 + x] === ME) {
				while (true) {
					x -= DIR[d][0];
					y -= DIR[d][1];
					if (x === px && y === py) break;

					board[y * 10 + x] = ME;
				}
				break;
			}
		}
	}
	return board;
}

function _checkIsEnablePlayerToPut(board, players, playerName) {
	for (var x = 1; x <= 8; x++) {
		for (var y = 1; y <= 8; y++) {
			if (_checkIsPuttable(x, y, board, players, playerName)) {
				return true;
			}
		}
	}
	return false;
}

_.pPutMove = function(px, py, game, me) {
	console.log('Game.pPutMove');
	return new Promise(function(resolve, reject) {
		console.log(game);
		if (game.turn !== me.name) return reject(Error.invalidPlayer(me.name));
		if (!_checkIsPuttable(px, py, game.board, game.players, me.name)) return reject(Error.invalidMove(px, py));

		var enemyName = game.players[0] === me.name ? game.players[1] : game.players[0];

		game.board = _putMove(px, py, game.board, game.players, me.name);
		game.turn = _checkIsEnablePlayerToPut(game.board, game.players, enemyName) ? enemyName : me.name;
		game.moves.push({
			x: px,
			y: py,
			gameId: game.uuid,
			playerId: me.uuid,
			player: me.name,
			created: parseInt(Date.now() / 1000),
			updated: parseInt(Date.now() / 1000)
		});
		resolve(game);
	});
};

_.pPushChat = function(gameObj, currentUser, text) {
	console.log('Game.pPushChat');
	gameObj.chats.push({
		gameId: gameObj.uuid,
		player: currentUser.name,
		playerId: currentUser.uuid,
		text: text,
		created: parseInt(Date.now() / 1000)
	});
	console.log(gameObj.chats);
	return new Promise(function(resolve, reject) {
		var gameQuery = {
				uuid: gameObj.uuid,
				$or: [{
					players: currentUser.name
				}, {
					guests: currentUser.name
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

module.exports = _;