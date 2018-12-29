import { UserGameList } from './UserGameList';

export interface User {
    id: string,
    name: string,
    userGames: UserGameList,
}

export type UserList = User[];