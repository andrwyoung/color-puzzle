// LOGIC FOR PLACING, REMOVING PIECES AND VALIDATING PLACEMENT

import type { Board, Coordinate } from '../types/board-and-piece-types.ts';
import { BOARD_ROWS, BOARD_COLS } from  './constants/board.ts';

// Validate if a piece can be placed at the given position
export function isValidPlacement(
    board: Board,
    pieceCoordinates: Coordinate[],
    startRow: number,
    startCol: number
): boolean {
    return pieceCoordinates.every(([row, col]) => { // For each coordinate, in the array of coordinates that make up a single piece (variation)
            const newRow = row + startRow;
            const newCol = col + startCol;

        if (newRow < 0 || newRow >= BOARD_ROWS || newCol < 0 || newCol >= BOARD_COLS) { // Check if new coordinate is out of bounds
            return false;
        }

        return board[newRow][newCol] === 0;
    });
}

// Test if there is an unfillable gap
export function hasUnfillableGaps(board: Board): boolean {
    const visited = Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false)); // Create Boolean 5x11 grid of false
    
    for (let row = 0; row < BOARD_ROWS; row++) {
        for (let col = 0; col < BOARD_COLS; col++) {
            if (board[row][col] === 0 && !visited[row][col]) {
            const regionSize = floodFillCount(board, visited, row, col);
            if (regionSize <= 2) return true; // 1 or 2 square gaps = unfillable
            }
        }
    }
    return false;
}
  
export function floodFillCount(board: Board, visited: boolean[][], row: number, col: number): number {
    if (row < 0 || row >= BOARD_ROWS || col < 0 || col >= BOARD_COLS || 
        visited[row][col] || board[row][col] !== 0) {
        return 0;
    } // Cells or sections that are out of bounds, already visited, or not empty.

    visited[row][col] = true;
    return 1 + 
        floodFillCount(board, visited, row - 1, col) +
        floodFillCount(board, visited, row + 1, col) +
        floodFillCount(board, visited, row, col - 1) +
        floodFillCount(board, visited, row, col + 1);
}

// 'Place' piece - update board array to have placed piece ID at specified coordinates
export function placePiece(
    board: Board,
    pieceCoordinates: Coordinate[],
    startRow: number,
    startCol: number,
    pieceId: number
): void {
    pieceCoordinates.forEach(([row, col]) => {
        board[startRow + row][startCol + col] = pieceId // not checking for validity in this function
    });
}

// 'Remove' piece - targetted remove using anchor coordinate, specific piece/variation as parameter for now
export function removePieceByCoord(
    board: Board,
    pieceCoordinates: Coordinate[], // this assumes a known (stored) variation
    startRow: number, 
    startCol: number,
): void {
    pieceCoordinates.forEach(([row, col]) => {
        board[startRow + row][startCol + col] = 0
    });
}