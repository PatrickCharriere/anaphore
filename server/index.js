var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Database packages
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const uuidv4 = require('uuid/v4');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

	console.log('user connected');

	socket.on('createPlayer', (content) => {

		try {

			player = JSON.parse(content);
			playername = player.name;
			const user = {id: uuidv4(), name: playername, status: "waiting", currentScore: 0};

			db.get('users')
				.push(user)
				.write()
	
			db.update('count', n => n + 1)
				.write()

			socket.emit(
		
				'message',
				{
					message: "userCreated",
					userCreated: user,
				},
				
			);

		} catch(error) {

		}

	})

	socket.on('listWaitingRoom', (content) => {

		console.log('listWaitingRoom content: ', content)

		const formattedUserList = db.get('users').filter({ status: "waiting" }).value().map(user => {
			return {
				id: user.id,
				name: user.name,
				currentScore: user.currentScore,
			}
		});

		socket.emit(
			
			'message',
			{
				message: "formattedUserList",
				formattedUserList: formattedUserList,
			},
			
		);

	});

	socket.on('disconnect', function(){

		console.log('user disconnected');

	});

});


http.listen(3000, function(){
	
	db.defaults({ users: [], count: 0 })
		.write()

	console.log('listening on port 3000');
	
});
