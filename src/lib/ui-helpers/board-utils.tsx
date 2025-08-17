import type { BoardType } from "../../types/puzzle-types";

export function removePieceFromBoard(board: BoardType, pieceId: number): BoardType {
  return board.map(row => 
    row.map(cell => cell === pieceId ? 0 : cell)
  );
}

export function clearBoard(): BoardType {
  const BOARD_ROWS = 10; // Import from your constants
  const BOARD_COLS = 10; // Import from your constants
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0));
}