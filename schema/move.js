var mongoose = require('../model/db.js'),
	UserSchema = require('./user.js'),
	GameSchema = require('./game.js'),
	uuid = require('node-uuid');

var MoveSchema = new mongoose.Schema({
	deleted: {
		type: Boolean,
		default: false
	},
	gameId: String,
	player: String,
	playerId: String,
	x: Number,
	y: Number,
	created: Number,
	updated: Number
});

module.exports = MoveSchema;