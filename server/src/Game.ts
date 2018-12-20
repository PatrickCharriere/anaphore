import { User } from './users';
import { PieceSet } from './Piece';

export interface Game {
    players: User[];
    pieceSet: PieceSet;
    gameBoard: [];
}