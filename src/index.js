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

const app = require('http').createServer();
const io = require('socket.io')(app);

io.on('connection', socket => {
	console.log('client connected!');
	// Logged in user's payload
	let user = null;

	socket.on('jwt', jwt => {
		request({
			url: '/login/verify',
			baseUrl: config.backendURL,
			method: 'POST',
			headers: {
				Authorization: `Bearer ${jwt}`
			},
			json: true
		}, (err, res, body) => {
			console.log('body', body);
			if (err || body.error) {
				socket.emit('error', `There was a problem with realtimer verifying login! (${body.payload})`);
				console.log('There was error verifying JWT!');
				user = null;
				return;
			}

			user = body.payload;
			console.log('verified');
		});
	});

	socket.on('admin', ({ secret }));
});

app.listen(port, () => console.log(`Server listening on *:${port}`));
