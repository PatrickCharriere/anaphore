
import { User } from './User';
import * as express from 'express';
import * as http from 'http';
import * as socket_io from 'socket.io';
import { SocketChannel } from './SocketChannel';
import { Proposal, ProposalResponse } from './Proposal';
import { Game } from './Game';
import { UserList } from './UserList';
import { Validator } from './Validator';
import { Player } from './Player';

const app = express()
const httpServer = new http.Server(app as any)
export const io = socket_io(httpServer)

let users: UserList = new UserList()
let proposals: Proposal[] = [];
let games: Game[] = [];

io.on('connection', (socket) => {

	socket.on(SocketChannel.CreatePlayer, (message: any) => {
		
		try {

			const player: Player = Validator.checkAndCreatePlayer(message)
			const user = new User(player.name, socket)

			users.add(user)

			socket.emit(
				
				SocketChannel.PlayerCreated,
				user.formattedUser,
				
			);

		} catch(error) {

		}

	})

	socket.on(SocketChannel.ListWaitingRoomRequest, () => {

		socket.emit(
			SocketChannel.ListWaitingRoomReply,
			users
			.getWaitingUsers()
		);

	});

	socket.on(SocketChannel.ProposeGame, (message: any) => {

		let proposal: Proposal

		try {

			proposal = Validator.checkAndCreateProposal(message, users)
			addToProposalList(proposal);

		} catch(e) {

		}

		try {
			
			proposal.opponent
			.socket
			.emit(
			
				SocketChannel.GameProposed,
				proposal,
				
			);

		} catch(e) {

		}

	});

	socket.on(SocketChannel.GameProposalResponse, (message: any) => {

		let proposalResponse: ProposalResponse

		try {

			proposalResponse = Validator.checkAndCreateProposalResponse(message)
			
		} catch(e) {

		}

		const proposal = findProposalInList(proposalResponse.proposal)
		console.log(proposal)

		if (proposal) {

			let proposerSocket: socket_io.Socket
			let opponentSocket: socket_io.Socket

			try {

				proposerSocket = getSocketForUser(proposal.proposer.id)
				opponentSocket = getSocketForUser(proposal.opponent.id)

			} catch (error) {

				// proposer or opponent not found
				return

			}

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

		users.removeBySocket(socket.id)

	});

});


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

	let user: User;

	try {

		user = users.find(userId)

	}
	catch(error) {

		throw error

	}

	return user.socket;

}

function startGame(proposal: Proposal) {
	
	const userList: UserList = new UserList([
		proposal.proposer,
		proposal.opponent,
	])
	
	const game = new Game(userList)

	game.start()

	games.push(game)
	
}


httpServer.listen(3000, function(){

	console.log('Server started on port 3000');
	
});
