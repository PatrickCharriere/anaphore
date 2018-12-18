
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

export type UserList = User[];