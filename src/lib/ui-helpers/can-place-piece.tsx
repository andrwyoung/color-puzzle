import type { BoardType, Coordinate } from "../../types/puzzle-types";
import { BOARD_ROWS, BOARD_COLS } from "../constants/board-constants";

export function canPlacePiece(board: BoardType, pieceShape: Coordinate[], rowIndex: number, colIndex: number): boolean {
  for (const [dy, dx] of pieceShape) {
    const r = rowIndex + dy;
    const c = colIndex + dx;

    if (r < 0 || r >= BOARD_ROWS || c < 0 || c >= BOARD_COLS || board[r][c] !== 0) {
      return false;
    }
  }
  return true;
}
