// PUZZLE TYPES

export type BoardType = number[][];

export type Coordinate = [number, number];

export type PieceType = {
  letter: string;
  color: string;
  base: Coordinate[];
  variations: Coordinate[][]; // DEPRECATED
  url?: string;
  disableFlip?: boolean;
  disableRotation?: boolean;
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
  isSelected: boolean;
  orientation: Coordinate[];
  position: { row: number; col: number } | null;
};

export type PieceStatusMap = Record<number, PieceState>; // number = pieceId
