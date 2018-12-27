import { User } from './User';
import { Draw } from './Draw';

export const GAMEBOARD_HEIGHT = 15
export const GAMEBOARD_WIDTH = 15

export class Game {
    private _players: User[];
    private _draw: Draw;
    private _board: [];

    constructor(players: User[]) {

        this._players = players
        this._draw = new Draw()
        this._board = []
        
    }

}