
import { User, UserStatus } from './users';
import * as express from 'express';
import * as http from 'http';
import * as socket_io from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { SocketChannel } from './SocketChannel';
import { Proposal } from './Proposal';

const app = express()
const httpServer = new http.Server(app as any)
const io = socket_io(httpServer)

let userSockets = [];
const proposals: Proposal[] = [];

io.on('connection', (socket) => {

	socket.on(SocketChannel.CreatePlayer, (content) => {

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

	socket.on(SocketChannel.ProposeGame, (proposal) => {

		try {
			proposal = JSON.parse(proposal);
			addToProposalList(proposal);
		} catch(e) {}

		try {
			(userSockets.filter(userSocket => (userSocket.user.id == proposal.opponent.id))[0])
			.socket
			.emit(
			
				SocketChannel.GameProposed,
				proposal.proposer,
				
			);
		} catch(e) {}

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

function addToProposalList(proposal: Proposal): boolean {

	if(isProposalInList(proposal)) {

		console.log(proposals);
		return false

	} else {

		proposals.push(proposal)
		console.log(proposals);
		return true

	}

}

/**Returns the index where the proposal is in the proposal list
 * else returns -1 */
function isProposalInList(proposal: Proposal): boolean {

	const isInList = proposals
	.filter(prop => ((proposal.proposer.id == prop.proposer.id) || (proposal.proposer.id == prop.opponent.id)))
	.filter(propRestricted => ((proposal.opponent.id == propRestricted.proposer.id) || (proposal.opponent.id == propRestricted.opponent.id)))

	if(isInList.length == 0) {

		return false

	} else {

		return true

	}

	

}

httpServer.listen(3000, function(){

	console.log('Server started on port 3000');
	
});
