
import { UserGame } from './UserGame';

export class UserGameList {

    private _userGames: UserGame[]

    constructor() {}

    find(gameId: string): UserGame {

        try {
            return this._userGames.filter(userGame => userGame.gameId == gameId)[0] || null
        }
        catch(error) {
            return null
        }

    }

}