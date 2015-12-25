const Error = {};

Error.pipeErrorRender = function(req, res, err) {
	return res.ng(err.code, {
		error: err.error
	});
};

Error.mongoose = function(code, err) {
	console.log(err);
	return {
		code: code,
		error: {
			message: err.message
		}
	};
};

Error.invalidParameter = {
	code: 400,
	error: {
		message: 'INVALID_PARAMETER'
	}
};

Error.unauthorized = {
	code: 401,
	error: {
		message: 'Unauthorized'
	}
};

Error.invalidMove = function(x, y) {
	return {
		code: 500,
		error: {
			message: `MOVE_IS_NOT_PUTTABLE at (${x}, ${y})`
		}
	};
};

Error.invalidPlayer = function(user) {
	return {
		code: 500,
		error: {
			message: `It's not ${user} turn now.`
		}
	};
};

module.exports = Error;