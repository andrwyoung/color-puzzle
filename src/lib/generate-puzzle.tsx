// GENERATE A RANDOM PUZZLE USING THE DATE AS THE SEED
// TO-DO: NEED TO CREATE REVEAL HINT HELPER FUNCTION

import { BOARD_ROWS, BOARD_COLS } from './constants/board.ts';
import { PIECES, ALL_PIECE_IDS } from './constants/pieces.ts';
import type { Board, Coordinate, PuzzleData, RemovedPiece } from '../types/puzzle-types.ts';
import { isValidPlacement, hasUnfillableGaps, placePiece, removePieceByCoord } from './move-piece.tsx';

// Seeded number generator
const MODULUS = 2 ** 32;
const MULTIPLIER = 1664525;
const INCREMENT = 1013904223;

export function createSeededRandom(seed: number) {
    let currentSeed = seed;
  
    const next = () => {
      currentSeed = (currentSeed * MULTIPLIER + INCREMENT) % MODULUS;
      return currentSeed / MODULUS;
    };
  
    const nextInt = (min: number, max: number) => {
      return Math.floor(next() * (max - min)) + min;
    };
  
    return { next, nextInt };
  }

// Initialize seeded random using today's date
export function initSeededRandomWithDate(date: Date) {
  const dateString = date.toISOString().split("T")[0];
    let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
        seed = seed * 31 + dateString.charCodeAt(i);
    }
    return createSeededRandom(seed);
}

// Create shuffled array using Fisher Yates, seeded random
export function shuffleArray<T>(
  array: T[],
  random: ReturnType<typeof createSeededRandom>
): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = random.nextInt(0, i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Shuffle array of variations for a piece
export function shuffleVariations(
    pieceId: number, 
    random: ReturnType<typeof createSeededRandom>
): Coordinate[][] {
    const piece = PIECES[pieceId];
    return shuffleArray(piece.variations, random);
}

// Create empty board (5x11)
export function createEmptyBoard(): Board {
    return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0));
}

// For a given board and piece variation, return array of valid placement positions (anchor coords)
export function findValidPositions(board: Board, pieceCoordinates: Coordinate[]): Coordinate[] {
    const validPositions: Coordinate[] = [];

    for (let row = 0; row < 5; row++){
        for (let col = 0; col < 11; col++) {
            if (isValidPlacement(board, pieceCoordinates, row, col)) {
                validPositions.push([row, col]);
            }
        }
    }

    return validPositions
} 

// Recursive function to solve 
export function solveBoardStep(
    board: Board,
    shuffledPieceIds: number[], // Array of piece IDs. This is the order that pieces are placed during solving.
    pieceIndex: number, // Because am calling recursively, need to track how many pieces have been placed
    random: ReturnType<typeof createSeededRandom>
): boolean {

    // Check: are all pieces placed? True = solved.
    if (pieceIndex >= shuffledPieceIds.length) {
        return true; 
    }

    // Select appropriate piece from array + shuffle variations
    const currentPieceId = shuffledPieceIds[pieceIndex];
    const shuffledVariations = shuffleVariations(currentPieceId, random);

    // For each variation, try the set of valid positions in a random order
    for (const variation of shuffledVariations) {
        const validPositions = findValidPositions(board, variation);
        const shuffledValidPositions = shuffleArray(validPositions, random);

         // Call solveBoardStep for the next piece in the list of pieces, and repeat process.
         for (const [startRow, startCol] of shuffledValidPositions) {
            placePiece(board, variation, startRow, startCol, currentPieceId);

            if (hasUnfillableGaps(board)) {
                removePieceByCoord(board, variation, startRow, startCol);
                continue;
            }

            if (solveBoardStep(board, shuffledPieceIds, pieceIndex + 1, random)) {
                return true; // This will recursively call, and only return true when opening clause returns true @ pieceIndex >= 12
            }

            removePieceByCoord(board, variation, startRow, startCol);
        }
    }

    return false;  // No solution for this configuration of pieces
}

// Tie it all together, generate a solved board with random seed
export function generateSolvedBoard(date: Date = new Date()): Board | null {
    const random = initSeededRandomWithDate(date);
    const board = createEmptyBoard();

    const pieceIds = ALL_PIECE_IDS;
    const shuffledPieceIds = shuffleArray(pieceIds, random);

    const success = solveBoardStep(board, shuffledPieceIds, 0, random); // Reminder: returns boolean if board is solved

    return success ? board : null; // Reminder: places pieces on board while solving
}

// Create puzzle from solved board
export function createPuzzleFromSolution(
    solution: Board,
    random: ReturnType<typeof createSeededRandom>,
): PuzzleData {
    const allPieceIds = ALL_PIECE_IDS;
    const shuffledPieceIds = shuffleArray(allPieceIds, random);
    const fixedPieces = shuffledPieceIds.slice(0, 2);
    const removablePieces = shuffledPieceIds.slice(2);

    // Create starting board (deep copy)
    const startingBoard = solution.map(row => [...row]);

    // Remove pieces
    removablePieces.forEach(pieceId => {
        for (let row = 0; row < BOARD_ROWS; row++) {
            for (let col = 0; col < BOARD_COLS; col++) {
                if (startingBoard[row][col] == pieceId) {
                    startingBoard[row][col] = 0; // 'Remove' piece by setting coordinate to 0
                }
            }
        }
    });

    return {
        startingBoard,
        solution,
        fixedPieces,
        removablePieces
    };
}

// Print board
export function printBoard(board: Board): void {
    board.forEach(row => {
        console.log(row.map(cell => cell || '.').join(' '));
    });
}

// Verify board is filled (just in case)
export function isBoardComplete(board: Board): boolean {
    return board.every(row => row.every(cell => cell !== 0));
}

// -----------------------------------------------------------------------------------------

// MAIN FUNCTION to generate today's puzzle
export function generateDailyPuzzle(date: Date = new Date()): PuzzleData {
    const random = initSeededRandomWithDate(date);
    const solution = generateSolvedBoard(date);

    if (!solution) {
        throw new Error(`Failed to generate puzzle for date: ${date.toISOString()}`);
    }

    if (!isBoardComplete(solution)) {
        throw new Error('Generated solution is incorrect.')
    }

    return createPuzzleFromSolution(solution, random);
}