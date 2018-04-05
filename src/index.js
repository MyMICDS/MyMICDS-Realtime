/**
 * @file Main file of the whole project.
 */

let config;
try {
	config = require(__dirname + '/config.js');
} catch(e) {
	throw new Error('***PLEASE CREATE A CONFIG.JS ON YOUR LOCAL SYSTEM. REFER TO SRC/CONFIG.EXAMPLE.JS***');
}

const port = process.env.PORT || config.port;

const request = require('request');

const io = require('socket.io')(port);
console.log(`Server listening on *:${port}`);

io.on('connection', socket => {
	console.log('client connected!');
	// Logged in user's payload
	let user = null;

	socket.on('jwt', jwt => {
		request({
			url: '/auth/verify',
			baseUrl: config.backendURL,
			method: 'POST',
			headers: {
				Authorization: `Bearer ${jwt}`
			},
			json: true
		}, (err, res, body) => {
			console.log('body', body);
			if (err || body.error) {
				socket.emit('jwt', `There was a problem with realtime verifying login! (${body.payload})`);
				console.log('There was error verifying JWT!');
				user = null;
				return;
			}

			user = body.payload;
			console.log('verified');

			socket.emit('jwt', true);
		});
	});

	socket.on('admin', (command) => {
		if (user && user.scopes.contains('admin')) {
			console.log('do something');
		}
	});
});
