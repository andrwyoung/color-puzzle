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

// TO-DO: DISCUSS WITH @ANDREW ABOUT PIECE PLACEMENT AND STATE TRACKING
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



// TESTS - note: don't know where to put these, but keeping here for now
const testBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const testboard1 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [22, 0, 33, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 33, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const testPiece = [[0,0], [1,0]] as Coordinate[]; // 2-block vertical piece

// Log board 
function printBoard(board: Board): void {
    board.forEach(row => {
        console.log(row.map(cell => cell.toString().padStart(2, ' ')).join(' '));
    });
    console.log(''); // Empty line for spacing
}

// Check if boards are identical
function boardsEqual(board1: Board, board2: Board): boolean {
    return board1.every((row, i) => 
        row.every((cell, j) => cell === board2[i][j])
    );
}

// Test place, remove piece
console.log('Testing place, remove piece')

placePiece(testBoard, testPiece, 1, 0, 22); //arbitrary id
placePiece(testBoard, testPiece, 2, 2, 33); 

console.log('Should be TRUE:', boardsEqual(testBoard, testboard1));
printBoard(testBoard)

removePieceByCoord(testBoard, testPiece, 2, 2);

console.log('Removed piece, should be FALSE:', boardsEqual(testBoard, testboard1));
printBoard(testBoard)

// Test isValidPlacement
console.log('Testing isValidPlacement')
console.log('Should be FALSE (hits piece1):', isValidPlacement(testBoard, testPiece, 0, 0));
console.log('Should be TRUE (empty spot):', isValidPlacement(testBoard, testPiece, 0, 3));  
console.log('Should be FALSE (out of bounds):', isValidPlacement(testBoard, testPiece, 4, 0));
console.log('Should be FALSE (off right edge):', isValidPlacement(testBoard, testPiece, 0, 11));