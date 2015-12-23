var mongoose = require('../model/db.js'),
	crypto = require('crypto'),
	uuid = require('node-uuid');

function _createToken() {
	return crypto.createHash('sha512').update(crypto.randomBytes(256).toString()).digest('hex');
};

var UserSchema = new mongoose.Schema({
	deleted: {
		type: Boolean,
		default: false
	},
	name: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	uuid: String,
	token: String,
	created: Number,
	updated: Number
});

UserSchema.pre('save', function(next) {
	console.log('User.presave');
	now = parseInt(Date.now() / 1000);
	this.updated = now;
	if (!this.created) this.created = now;
	this.uuid = uuid.v4();
	this.token = _createToken();

	next();
});

UserSchema.on('index', function(err) {
	console.log('on index');
});

module.exports = UserSchema;