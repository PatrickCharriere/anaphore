
import * as socket_io from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Piece } from './Piece';
import { UserGameList } from './UserGameList';
import { SocketChannel } from './SocketChannel';

export const MAX_USER_HAND = 3

export enum UserStatus {
    Waiting = 'Waiting',
    Playing = 'Playing',
}

export type UserList = User[];

export interface FormattedUser {
    id: string,
    name: string,
    userGames: UserGameList,
}

export class User {

    private _id: string
    private _name: string
    private _status: UserStatus
    private _socket: socket_io.Socket
    private _userGames: UserGameList

    constructor(name: string, socket: socket_io.Socket) {
        
        this._id = uuidv4()
        this._name = name
        this._status = UserStatus.Waiting
        this._socket = socket

    }

    public get id() : string {
        return this._id
    }

    public get name() : string {
        return this._name
    }

    public get socket() : socket_io.Socket {
        return this._socket
    }

    public get status() : UserStatus {
        return this._status
    }
    
    public get formattedUser() : FormattedUser {

        return {
            id: this._id,
            name: this._name,
            userGames: this._userGames
        }

    }

    public set status(status: UserStatus) {

        this._status = status
        this.publishUserStateUpdate()

    }

    public setHand(gameId: string, pieces: Piece[]): void {

        // Incorrect hand
        if (pieces.length > MAX_USER_HAND) return

        this._userGames.find(gameId).setHand(pieces);

        this.publishUserStateUpdate()

    }

    public setCurrent(gameId: string) {

        //this._userGames.find(gameId).setCurrentPlayer()

        this.publishUserStateUpdate()

    }

    public unsetCurrent = (gameId: string) => {

        //this._userGames.find(gameId).unsetCurrentPlayer()

        this.publishUserStateUpdate()

    }

    public publishUserStateUpdate() {

        this._socket.emit(
            SocketChannel.PlayerStatus,
            this.formattedUser
        )
        
    }

}