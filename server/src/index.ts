
import { User, UserStatus } from './users';
import * as express from 'express';
import * as http from 'http';
import * as socket_io from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { SocketChannel } from './SocketChannel';

const app = express()
const httpServer = new http.Server(app as any)
const io = socket_io(httpServer)

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let userSockets = [];

io.on('connection', (socket) => {

	socket.on(SocketChannel.CreatePlayer, (content) => {

		console.log(SocketChannel.CreatePlayer, content);

		try {

			const player = JSON.parse(content);
			const playername = player.name;
			const user: User = {id: uuidv4(), name: playername, status: UserStatus.Waiting, currentScore: 0};

			userSockets.push({user:user, socket:socket});

			socket.emit(
		
				SocketChannel.PlayerCreated,
				user,
				
			);

			broadcastUserList();

		} catch(error) {

		}

	})

	socket.on(SocketChannel.ListWaitingRoomRequest, () => {

		socket.emit(
			SocketChannel.ListWaitingRoomReply,
			userSockets.map(userSocket => userSocket.user),
		);

	});

	socket.on(SocketChannel.ProposeGame, (content) => {

		console.log(SocketChannel.ProposeGame, content);

	});

	socket.on('disconnect', function(){

		userSockets = userSockets.filter(userSocket => (userSocket.socket.id != socket.id))
		broadcastUserList();

	});

});

function broadcastUserList() {
	
	io.emit(
		SocketChannel.ListWaitingRoomReply,
		userSockets.map(userSocket => userSocket.user),
	);

}

httpServer.listen(3000, function(){

	console.log('listening on port 3000');
	
});
