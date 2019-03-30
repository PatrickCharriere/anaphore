import { User, UserStatus, MAX_USER_HAND } from './User';
import { Draw } from './Draw';
import { UserList } from './UserList';
import { Piece } from './Piece';
import { v4 as uuidv4 } from 'uuid';
import { ScoreSet } from './ScoreSet';
import { Easel } from './Easel';

export const GAMEBOARD_HEIGHT = 15
export const GAMEBOARD_WIDTH = 15

enum GameState {
    Paused = 'Paused',
    InProgress = 'InProgress',
    Stopped = 'Stopped',
}

export class Game {

    private _id: string
    private _users: UserList
    private _draw: Draw
    private _board: Piece[][]
    private _currentUserId: string
    private _gameState: GameState
    private _easels: Easel[]
    private _scores: ScoreSet

    constructor(users: UserList) {

        this._id = uuidv4()
        this._gameState = GameState.Paused
        this._users = users
        this._draw = new Draw()
        this._board = []
        this._easels = []
        
    }

    start() {

        // Update game state
        this._gameState = GameState.InProgress

        // Update users statuses
        this._users.setStatuses(UserStatus.Playing)
        
        // Select first user to play
        this.setCurrentUser(this._users.getRandomUserInList())

        // Give first pieces to users
        this._users.users.map(user => {
            this._easels.push(new Easel(this.getPiecesFromDraw(MAX_USER_HAND), user.id))
        })

        this._easels.map(easel => {
            console.log('User:', easel.userId)
            easel.pieces.map(piece => {
                console.log('Piece:', piece)
            })
        })
        
    }

    public setCurrentUser(user: User) {

        // Set current user value
        this._currentUserId = user.id

    }

    public getPiecesFromDraw(quantity: number): Piece[] {

        quantity = (quantity > MAX_USER_HAND) ? MAX_USER_HAND : quantity

        return this._draw.takeRandom(quantity)

    }

}