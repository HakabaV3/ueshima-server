var mongoose = require('./db.js'),
	schema = require('../schema/game.js'),
	Error = require('./error.js');

var _ = {},
	model = mongoose.model('Game', schema);

_.pGet = function(user, option) {
	console.log('Game.pGet');
	console.log(user);
	var query = {
		players: user.name,
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

	return new Promise(function(resolve, reject) {
		model.findOne(query, function(err, game) {
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

_.pPush = function(gameQuery, moveQuery, userObj, gameObj) {
	console.log('Game.pPush');

	if (!userObj) return reject(Error.unauthorized);
	moveQuery.player = userObj.name;
	moveQuery.playerId = userObj.uuid;
	var partner = gameObj.players[0] == userObj.name ? gameObj.players[1] : gameObj.players[0]
	console.log(partner);

	return new Promise(function(resolve, reject) {
		model.findOneAndUpdate(gameQuery, {
			turn: partner,
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
		turn: game.turn,
		moves: game.moves,
		created: game.created,
		updated: game.updated
	};
	return res.ok(200, {
		game: gameObj
	});
};

_.pipeSuccessRenderAll = function(req, res, games) {
	console.log('Game.pipeSuccessRendeAllr\n');
	return res.ok(200, {
		games: games.map(function(game) {
			return {
				id: game.uuid,
				players: game.players,
				turn: game.turn,
				moves: game.moves,
				created: game.created,
				updated: game.updated
			};
		})
	});
};

module.exports = _;