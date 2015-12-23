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
	// uuid: String,
	created: Number,
	updated: Number
});

MoveSchema.pre('save', function(next) {
	cosole.log('Move.presave');
	now = parseInt(Date.now() / 1000);
	this.updated = now;
	if (!this.created) this.created = now;
	// this.uuid = uuid.v4();

	next();
});

module.exports = MoveSchema;