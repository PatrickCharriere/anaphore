
import * as socket_io from 'socket.io';

export enum UserStatus {
    Waiting = 'Waiting',
    Playing = 'Playing',
}

export type User = {
    id: string,
    name: string,
    status: UserStatus,
    currentScore: number
};

export type UserSocket = {
    user: User,
    socket: socket_io.Socket,
}

export type UserList = User[];