
import { User, UserStatus, UserSocket } from './users';
import * as express from 'express';
import * as http from 'http';
import * as socket_io from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { SocketChannel } from './SocketChannel';
import { Proposal, ProposalResponse } from './Proposal';

const app = express()
const httpServer = new http.Server(app as any)
const io = socket_io(httpServer)

let userSockets: UserSocket[] = [];
let proposals: Proposal[] = [];

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
			proposal = JSON.parse(proposal) as Proposal;
			addToProposalList(proposal);
		} catch(e) {}

		try {
			(userSockets.filter(userSocket => (userSocket.user.id == proposal.opponent.id))[0])
			.socket
			.emit(
			
				SocketChannel.GameProposed,
				proposal,
				
			);
		} catch(e) {}

	});

	socket.on(SocketChannel.GameProposalResponse, (proposalResponse) => {
		
		try {

			proposalResponse = JSON.parse(proposalResponse) as ProposalResponse
			
		} catch(e) {}

		const proposal = findProposalInList(proposalResponse.proposal)

		if (proposal) {
			const proposerSocket: socket_io.Socket = getSocketForUser(proposal.proposer)
			const opponentSocket: socket_io.Socket = getSocketForUser(proposal.opponent)
			let socketToReplyTo: socket_io.Socket;

			if ((proposerSocket.id == socket.id) && (opponentSocket.id == socket.id)) {

				// Someone else replied to game proposal
				return

			}

			if (proposerSocket.id == socket.id) {
				
				socketToReplyTo = opponentSocket;

			} else if (opponentSocket.id == socket.id) {
				
				socketToReplyTo = proposerSocket;

			}

			socketToReplyTo.emit(
			
				SocketChannel.GameProposalResponse,
				proposalResponse,
				
			);

			removeProposalFromList(proposal)

			startGame(proposal)

		}

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

	if(findProposalInList(proposal)) {

		return false

	} else {

		proposals.push(proposal)
		return true

	}

}

/**Returns the index where the proposal is in the proposal list
 * else returns -1 */
function findProposalInList(proposal: Proposal): Proposal {

	const isInList = proposals
	.filter(prop => ((proposal.proposer.id == prop.proposer.id) || (proposal.proposer.id == prop.opponent.id)))
	.filter(propRestricted => ((proposal.opponent.id == propRestricted.proposer.id) || (proposal.opponent.id == propRestricted.opponent.id)))

	if(isInList.length == 0) {

		return null

	} else {

		return isInList[0]

	}

	

}

function removeProposalFromList(proposal: Proposal) {

	proposals = proposals
		.filter(prop => ((proposal.proposer.id != prop.proposer.id) || (proposal.opponent.id != prop.opponent.id)) &&
			((proposal.opponent.id != prop.proposer.id) || (proposal.proposer.id != prop.opponent.id))
		)

}

function getSocketForUser(user: User): socket_io.Socket {

	const userSocket = userSockets.filter(userSocket => (userSocket.user.id == user.id))

	if (userSocket.length == 0) {
		return null;
	} else {
		return userSocket[0].socket;
	}

}

function startGame(proposal: Proposal) {

}

httpServer.listen(3000, function(){

	console.log('Server started on port 3000');
	
});
