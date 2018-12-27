import { Piece } from './Piece';
export const DEFAULT_DRAW = [9,9,8,8,7,8,6,6,4,4,3,3,2,2,1,1,2]

export class Draw {

    private _pieces: Piece[];

    constructor() {
        this._pieces = this.createDefault()
    }

	createDefault(): Piece[] {

		let pieceSet: Piece[] = []
		
		for (let i = 0; i < DEFAULT_DRAW.length; i++) {
	
			for (let j = 0; j < DEFAULT_DRAW[i]; j++) {
	
				let piece: Piece = {value: i}
				pieceSet.push(piece)
			
			}
			
		}
	
		return pieceSet
	
	}
	
}