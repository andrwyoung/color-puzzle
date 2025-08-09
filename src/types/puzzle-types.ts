// PUZZLE TYPES

export type BoardType = number[][];

export type Coordinate = [number, number];

export type PieceType = {
  letter: string;
  color: string;
  base: Coordinate[];
  variations: Coordinate[][]; // DEPRECATED
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

// we can rotate it 4 times or we can flip it!
// beats manually keeping track of variations
export type OrientationType = { rotation: 0 | 1 | 2 | 3, flip: 0 | 1 };

// this is how we keep track of what pieces are on the board
export type PieceState = {
  isOnBoard: boolean;
  orientation: OrientationType;
  position: { row: number; col: number } | null;
};

export type PieceStatusMap = Record<number, PieceState>; // number = pieceId
