import { Piece } from './Piece';

export interface EaselStruct { _pieces: Piece[], _userId: string }

export class Easel {

    private _pieces: Piece[]
    private _userId: string

    constructor(pieces: Piece[], userId: string) {

        this._pieces = pieces
        this._userId = userId

    }

    get pieces(): Piece[] {

        //TODO: check that user is allowed to view the pieces
        return this._pieces
        
    }

    get userId(): string {

        return this._userId
        
    }

}