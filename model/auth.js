var mongoose = require('./db.js'),
	schema = require('../schema/auth.js'),
	AuthHelper = require('../helper/auth.js'),
	Error = require('./error.js');

var _ = {},
	AuthModel = mongoose.model('Auth', schema),
	UserModel = mongoose.model('User', require('../schema/user.js'));

_.pSignIn = function(name, password) {
	console.log('Auth.pSignIn');
	var query = {
		name: name,
		password: AuthHelper.toHashedPassword(password),
		deleted: false
	};
	return new Promise(function(resolve, reject) {
		UserModel.findOne(query, {}, function(err, user) {
			if (err) return reject(Error.mongoose(500, err));
			if (!user) return reject(Error.unauthorized);

			return resolve(user);
		});
	});
};

_.pGetOne = function(query) {
	console.log('Auth.pGetOne');
	return new Promise(function(resolve, reject) {
		AuthModel.findOne(query, {}, function(err, auth) {
			if (err) return reject(Error.mongoose(500, err));
			if (!auth) return reject(Error.unauthorized);

			return resolve(auth);
		});
	});
};

_.pCreate = function(userId, user) {
	console.log('Auth.pCreate');
	var query = {
		userId: userId,
		token: AuthHelper.createToken()
	};

	return new Promise(function(resolve, reject) {
		new AuthModel(query)
			.save(function(err, createdAuth) {
				if (err) return reject(Error.mongoose(500, err));
				if (!createdAuth) return reject(Error.invalidParameter);
				if (!user) resolve(createdAuth);

				user.token = createdAuth.token;
				return resolve(user);
			});
	});
};

_.pRemove = function(userId) {
	var query = {
		userId: userId
	};

	return new Promise(function(resolve, reject) {
		AuthModel.remove(query, function(err) {
			if (err) reject(Error.mongoose(500, err));
			resolve();
		});
	});
};

_.pRemoveExpiredObject = function(date) {
	var query = {
		expired: {
			$lte: date
		}
	};
	return new Promise(function(resolve, reject) {
		AuthModel.remove(query, function(err, res) {
			if (err) console.error(err);
			console.log(res.result.n);
			return true;
		});
	});
};

module.exports = _;