
import * as socket_io from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

export enum UserStatus {
    Waiting = 'Waiting',
    Playing = 'Playing',
}

export type UserList = User[];


export class User {
    private _id: string
    private _name: string
    private _status: UserStatus
    private _currentScore: number
    private _socket: socket_io.Socket

    constructor(name: string, socket: socket_io.Socket) {
        this._id = uuidv4()
        this._name = name
        this._status = UserStatus.Waiting
        this._currentScore = 0
        this._socket = socket


    }

    public get id() : string {
        return this._id
    }

    public get socket() : socket_io.Socket {
        return this._socket
    }

    public get status() : UserStatus {
        return this._status
    }



}