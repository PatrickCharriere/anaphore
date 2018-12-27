
/**
 * {x:0, y:0} represents the top left corner 
 * going down y increase
 * going to the right increases x
*/
export interface Position {
    x: number,
    y: number,
}

export interface Piece {
    value: number,
}

export type PieceSet = Piece[];
