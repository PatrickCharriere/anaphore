import { User } from './User';

export enum UserStatus {
    Waiting = 'Waiting',
    Playing = 'Playing',
}

export type UserList = User[];