
import { User, UserStatus } from './User';
import * as express from 'express';
import * as http from 'http';
import * as socket_io from 'socket.io';
import { SocketChannel } from './SocketChannel';
import { Proposal, ProposalResponse } from './Proposal';
import { Game } from './Game';

const app = express()
const httpServer = new http.Server(app as any)
const io = socket_io(httpServer)

let users: User[] = [];
let proposals: Proposal[] = [];
let games: Game[] = [];

io.on('connection', (socket) => {

	socket.on(SocketChannel.CreatePlayer, (content) => {

		try {

			const player = JSON.parse(content)
			const user = new User(player.name, socket)

			users.push(user);

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
			users
			.filter(user => {
				return (user.status == UserStatus.Waiting)
			})
		);

	});

	socket.on(SocketChannel.ProposeGame, (proposal) => {

		try {
			proposal = JSON.parse(proposal) as Proposal;
			addToProposalList(proposal);
		} catch(e) {}

		try {
			(users.filter(userSocket => (userSocket.id == proposal.opponent.id))[0])
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
			const proposerSocket: socket_io.Socket = getSocketForUser(proposal.proposer.id)
			const opponentSocket: socket_io.Socket = getSocketForUser(proposal.opponent.id)
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

		users = users.filter(userSocket => (userSocket.socket.id != socket.id))
		broadcastUserList();

	});

});

function broadcastUserList() {
	
	io.emit(
		SocketChannel.ListWaitingRoomReply,
		users.map(user => user),
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

function getSocketForUser(userId: string): socket_io.Socket {

	const user = users.filter(users => (users.id == userId))

	if (user.length == 0) {
		return null;
	} else {
		return user[0].socket;
	}

}

function startGame(proposal: Proposal) {

	const game = new Game([proposal.proposer, proposal.opponent])

	games.push(game)

	//console.log(game)

}


httpServer.listen(3000, function(){

	console.log('Server started on port 3000');
	
});
