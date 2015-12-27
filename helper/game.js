var _ = {};

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

_.checkIsPuttable = function(px, py, board, players, playerName) {
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

_.putMove = function(px, py, board, players, playerName) {
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

_.checkIsEnablePlayerToPut = function(board, players, playerName) {
	for (var x = 1; x <= 8; x++) {
		for (var y = 1; y <= 8; y++) {
			if (_.checkIsPuttable(x, y, board, players, playerName)) {
				return true;
			}
		}
	}
	return false;
};

_.addPuttablePointsToBoard = function(board, players, playerName) {
	if (players.indexOf(playerName) === -1) return [];
	for (var x = 1; x <= 8; x++) {
		for (var y = 1; y <= 8; y++) {
			if (_.checkIsPuttable(x, y, board, players, playerName)) {
				board[y * 10 + x] = 10;
			}
		}
	}
	return board
};

_.lastMove = function(game) {
	return game.moves[game.moves.length - 1];
};

_.colorOfMove = function(game, move) {
	return game.players[0] == move.player ? CellType.BLACK : CellType.WHITE;
}

module.exports = _;