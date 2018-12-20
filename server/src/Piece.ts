export const GAMEBOARD_HEIGHT = 15
export const GAMEBOARD_WIDTH = 15
export const DEFAULT_DRAW = [9,9,8,8,7,8,6,6,4,4,3,3,2,2,3,1,2]

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
