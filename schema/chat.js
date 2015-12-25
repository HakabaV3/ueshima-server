var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
	gameId: String,
	player: String,
	playerId: Number,
	text: String,
	created: Number
});

module.exports = ChatSchema;