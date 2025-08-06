// PUZZLE TYPES

export type BoardType = number[][];

export type Coordinate = [number, number];

export type PieceType = {
  letter: string;
  color: string;
  base: number[][];
  variations: Coordinate[][];
  url?: string;
};

export type PieceCollection = {
  [key: number]: PieceType;
};

export type PuzzleData = {
  startingBoard: BoardType;
  solution: BoardType;
  fixedPieces: number[];
  removablePieces: number[];
};
