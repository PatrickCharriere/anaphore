import { User, UserStatus, MAX_USER_HAND } from './User';
import { Draw } from './Draw';
import { UserList } from './UserList';
import { Piece } from './Piece';
import { v4 as uuidv4 } from 'uuid';
import { SocketChannel } from './SocketChannel';

export const GAMEBOARD_HEIGHT = 15
export const GAMEBOARD_WIDTH = 15

enum GameState {
    Paused = 'Paused',
    InProgress = 'InProgress',
}

export class Game {

    private _id: string
    private _users: UserList
    private _draw: Draw
    private _board: []
    private _currentUser: User
    private _gameState: GameState

    constructor(users: UserList) {

        this._id = uuidv4()
        this._users = users
        this._draw = new Draw()
        this._board = []
        this._gameState = GameState.Paused
        
    }

    start() {

        // Update game state
        this._gameState = GameState.InProgress

        // Update users statuses
        for (let i = 0; i < this._users.length; i++) {
            
            this._users[i].setStatus(UserStatus.Playing)
            
        }
        
        // Select first user to play
        this.resetCurrentUsers()
        this.setCurrentUser(this.randomUser())

        // Give first pieces to users
        this._users.setPieces(this._id, [
            this.getPiecesFromDraw(MAX_USER_HAND),
            this.getPiecesFromDraw(MAX_USER_HAND)
        ])

    }

    public setCurrentUser(user: User) {

        // Set current user value
        this._currentUser = user

        // TODO: Send notification to listeners
        this._currentUser.setCurrent(this._id)

    }

    private resetCurrentUsers() {

        this._users.unsetCurrentUsers(this._id)

    } 

    public getPiecesFromDraw(quantity: number): Piece[] {

        //TODO: check that user is allowed to get pieces

        quantity = (quantity > MAX_USER_HAND) ? MAX_USER_HAND : quantity

        return this._draw.takeRandom(quantity)

    }

    private randomUser(): User {

        const randomUserIndex = Math.floor(Math.random() * Math.floor(this._users.length))

        return this._users[randomUserIndex]

    }

}