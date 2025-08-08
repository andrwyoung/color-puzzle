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

// this is how we keep track of what pieces are on the board
export type PieceState = {
  isOnBoard: boolean;
  variation: number | null; // variation index. unsure how to do this still
  position: { row: number; col: number } | null;
};
export type PieceStatusMap = Record<number, PieceState>; // number = pieceId
