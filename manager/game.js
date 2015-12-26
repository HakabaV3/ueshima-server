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
}

_.puttablePoints = function(board, players, playerName) {
	var points = [];
	for (var x = 1; x <= 8; x++) {
		for (var y = 1; y <= 8; y++) {
			if (_.checkIsPuttable(x, y, board, players, playerName)) {
				points.push(y * 10 + x);
			}
		}
	}
	return points;
}

module.exports = _;