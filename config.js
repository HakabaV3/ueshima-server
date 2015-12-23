const config = {
	ENV: process.env.ENV || 'development-local',
	SERVER_PROTOCOL: 'http',
};

switch (config.ENV) {
	case 'development-local':
		Object.assign(config, {
			DB_HOST: 'localhost',
			DB_PORT: 27017,
			DB_NAME: 'ueshima-server-dev',
			EXPRESS_PORT: 3000,
		});
		break;

	case 'development-sakura':
		Object.assign(config, {
			DB_HOST: 'localhost',
			DB_PORT: 27017,
			DB_NAME: 'ueshima-server-dev',
			EXPRESS_PORT: 3000,
		});
		break;

	case 'staging':
		Object.assign(config, {
			DB_HOST: 'localhost',
			DB_PORT: 27018,
			DB_NAME: 'izu-server-staging',
			EXPRESS_PORT: 3001,
		});
		break;

	case 'production':
	default:
		console.error("Unknown ENV");
		process.exit();
}

console.log(`Welcome to ueshima-server! Environment is ${config.ENV} now!!`);

module.exports = config;