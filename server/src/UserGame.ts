
import { Piece } from './Piece';

export class UserGame {

    private _gameId: string = ''
    private _score: number = 0
    private _scoreLog: number[] = []
    private _hand: Piece[] = []

    constructor(gameId: string, hand?: Piece[]) {

        this._gameId = gameId
        this._hand = hand || []

    }

    public resetScore() {

        this._score = 0;
        this._scoreLog = []

    }

    public setHand(hand: Piece[]) {

        this._hand = hand

    }

    public get gameId(): string {

        return this._gameId

    }
}