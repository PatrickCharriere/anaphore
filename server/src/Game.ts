import { User, UserStatus } from './User';
import { Draw } from './Draw';

export const GAMEBOARD_HEIGHT = 15
export const GAMEBOARD_WIDTH = 15

enum GameState {
    Paused = 'Paused',
    InProgress = 'InProgress',
}

export class Game {
    private _players: User[];
    private _draw: Draw;
    private _board: [];
    private _currentPlayer: User;
    private _gameState: GameState;

    constructor(players: User[]) {

        this._players = players
        this._draw = new Draw()
        this._board = []
        this._gameState = GameState.Paused
        
    }

    start() {

        // Update players statuses
        for (let i = 0; i < this._players.length; i++) {
            
            const player = this._players[i]
            player.setStatus(UserStatus.Playing)
            
        }

        // Update game state
        this._gameState = GameState.InProgress

        // Select first user to play
        this._currentPlayer = this.randomUser()

        // Give first pieces to users

    }

    randomUser(): User {

        const randomUserIndex = Math.floor(Math.random() * Math.floor(this._players.length))

        return this._players[randomUserIndex]

    }

}