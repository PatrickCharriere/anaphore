import { SocketChannel } from './SocketChannel';
import { User, UserStatus, UserList } from './users';
import * as express from 'express';
import * as http from 'http';
import * as socket_io from 'socket.io';

const app = express()
const httpServer = new http.Server(app as any)
const io = socket_io(httpServer)

// Database packages
import * as low from 'lowdb';
import {LoDashExplicitSyncWrapper} from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
const adapter = new FileSync('db.json')
const db: LoDashExplicitSyncWrapper<{users: UserList}> = low(adapter)
import { v4 as uuidv4 } from 'uuid';

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

	console.log('user connected');

	socket.on(SocketChannel.CreatePlayer, (content) => {

		console.log(SocketChannel.CreatePlayer, content);

		try {

			const player = JSON.parse(content);
			const playername = player.name;
			const user: User = {id: uuidv4(), name: playername, status: UserStatus.Waiting, currentScore: 0};

			db.get('users')
				.push(user)
				.write()
	
			db.update('count', n => n + 1)
				.write()

			socket.emit(
		
				SocketChannel.PlayerCreated,
				user,
				
			);

		} catch(error) {

		}

	})

	socket.on(SocketChannel.ListWaitingRoomRequest, (content) => {

		const formattedUserList = (db.get('users').filter({ status: UserStatus.Waiting }).value() as UserList).map(user => {
			return {
				id: user.id,
				name: user.name,
				currentScore: user.currentScore,
			}
		});

		socket.emit(
			SocketChannel.ListWaitingRoomReply,
			formattedUserList,
		);

	});

	socket.on('disconnect', function(){

		console.log('user disconnected');

	});

});


httpServer.listen(3000, function(){
	
	db.defaults({ users: [], count: 0 })
		.write()

	console.log('listening on port 3000');
	
});
