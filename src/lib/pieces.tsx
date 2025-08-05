export interface Piece {
    letter: string;
    url?: string;
    rotations: number[][][];
    color: string;
}

export interface PieceCollection {
    [key: number]: Piece;
}
