var mongoose = require('../model/db.js'),
	MoveSchema = require('./move.js'),
	ChatSchema = require('./chat.js'),
	uuid = require('node-uuid');

var GameSchema = new mongoose.Schema({
	deleted: {
		type: Boolean,
		default: false
	},
	players: [String],
	guests: [String],
	moves: [MoveSchema],
	chats: [ChatSchema],
	board: [Number],
	turn: String,
	uuid: String,
	created: Number,
	updated: Number
});

GameSchema.pre('save', function(next) {
	now = parseInt(Date.now() / 1000);
	this.updated = now;
	if (!this.created) this.created = now;
	if (!this.uuid) this.uuid = uuid.v4();
	this.board = _setupBoard();

	next();
});

const CellType = {
	BLACK: -1,
	EMPTY: 0,
	WHITE: 1,
};

function _setupBoard() {
	var board = [];
	for (var x = 0; x <= 9; x++) {
		for (var y = 0; y <= 9; y++) {
			board[y * 10 + x] = CellType.EMPTY;
		}
	}
	board[4 * 10 + 4] = board[5 * 10 + 5] = CellType.BLACK;
	board[4 * 10 + 5] = board[5 * 10 + 4] = CellType.WHITE;
	return board;
}

module.exports = GameSchema;