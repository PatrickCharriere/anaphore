import { User, UserStatus } from "./User";
import { io } from './index';
import { SocketChannel } from './SocketChannel';
import * as socket_io from 'socket.io';
import { Piece } from './Piece';

export class UserList {

    private _users: User[] = [];

    constructor(userList?: User[]) {

        this._users = userList || []

    }

    add(user: User) {

        this._users.push(user)

        this.broadcastUserList()
    
    }

    get length(): number {

        return this._users.length
        
    }

    removeBySocket(socketId: string) {

        this._users = this._users.filter(userSocket => (userSocket.socket.id != socketId))
        
        this.broadcastUserList()

    }
    
    find(userId: string): User {

        const users: User[] = this._users.filter(user => (user.id == userId))

        if (users.length > 0) {

            return users[0]

        } else {

            throw Error

        }

    }

    broadcastUserList() {
        
        io.emit(
            SocketChannel.ListWaitingRoomReply,
            this._users.map(user => user.formattedUser),
        );
    
    }

    getWaitingUsers() {

        return this._users.filter(user => {
            return (user.status == UserStatus.Waiting)
        })
        .map(user => (user.formattedUser || []))

    }

    getSocketForUser(userId: string): socket_io.Socket {

        let user: User;
    
        try {
    
            user = this.find(userId)
    
        }
        catch(error) {
    
            throw error
    
        }
    
        return user.socket;
    
    }
    
    setPieces(gameId: string, pieces: Piece[][]) {

        for (let i = 0; i < pieces.length; i++) {
            
            // TODO: Check that _users length is the same as pieces length
            this._users[i].setHand(gameId, pieces[i])
            
        }
    }

    unsetCurrentUsers(gameId: string) {

        for (const user of this._users) {
            user.unsetCurrent(gameId)
        }

    }

    setStatuses(userStatus: UserStatus) {

        for (let i = 0; i < this._users.length; i++) {
            
            this._users[i].status = userStatus
            
        }

    }

}
