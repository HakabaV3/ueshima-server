var mongoose = require('../model/db.js'),
	// UserSchema = require('./user.js'),
	MoveSchema = require('./move.js'),
	uuid = require('node-uuid');

var GameSchema = new mongoose.Schema({
	deleted: {
		type: Boolean,
		default: false
	},
	players: [String],
	moves: [MoveSchema],
	turn: String,
	uuid: String,
	created: Number,
	updated: Number
});

GameSchema.pre('save', function(next) {
	now = parseInt(Date.now() / 1000);
	this.updated = now;
	if (!this.created) this.created = now;
	this.uuid = uuid.v4();

	next();
});

module.exports = GameSchema;