// PUZZLE TYPES

export type Board = number[][];

export type Coordinate = [number, number];

export interface Piece {
  letter: string;
  color: string;
  base: number[][];
  variations: Coordinate[][];
  url?: string;
}

export interface PieceCollection {
  [key: number]: Piece;
}

export interface PuzzleData {
  startingBoard: Board;
  solution: Board;
  fixedPieces: number[];
  removablePieces: number[];
}
