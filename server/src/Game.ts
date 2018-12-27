import { User } from './User';
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
    private _currentPlayerId: string;
    private _gameState: GameState;

    constructor(players: User[]) {

        this._players = players
        this._draw = new Draw()
        this._board = []
        this._gameState = GameState.Paused
        
    }

    start() {

        // Update players statuses

        // Update game state

        // Select first user to play

        // Give first pieces to users

    }

}