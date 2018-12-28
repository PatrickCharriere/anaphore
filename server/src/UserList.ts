import { User, UserStatus } from "./User";
import { io } from './index';
import { SocketChannel } from './SocketChannel';

export class UserList {

    private _users: User[] = [];

    constructor() {

    }

    add(user: User) {

        this._users.push(user)

        this.broadcastUserList()
    
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

}
