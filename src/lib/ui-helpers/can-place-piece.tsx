import type { BoardType } from "../../types/puzzle-types";
import { BOARD_ROWS, BOARD_COLS } from "../constants/board-constants";

export function canPlacePiece(board: BoardType, variation: number[][], rowIndex: number, colIndex: number): boolean {
  for (const [dy, dx] of variation) {
    const r = rowIndex + dy;
    const c = colIndex + dx;

    if (r < 0 || r >= BOARD_ROWS || c < 0 || c >= BOARD_COLS || board[r][c] !== 0) {
      return false;
    }
  }
  return true;
}
