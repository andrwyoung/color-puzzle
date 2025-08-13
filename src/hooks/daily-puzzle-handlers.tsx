// handle setup and storage of daily puzzle

import type { BoardType, Coordinate, PieceStatusMap, PieceState, PuzzleData } from "../types/puzzle-types";
import { BOARD_COLS, BOARD_ROWS } from "../lib/constants/board-constants";
import { ALL_PIECES } from "../lib/constants/piece-constants";
import { generateDailyPuzzle } from "../lib/generate-puzzle";

export function useDailyPuzzle({
    setCurrentBoard,
    pieceStatus,
    setPieceStatus,
    dailyPuzzle,        // ← Receive from Board
    setDailyPuzzle,     // ← Receive from Board
    puzzleLoaded,       // ← Receive from Board
    setPuzzleLoaded     // ← Receive from Board
  }: {
    setCurrentBoard: React.Dispatch<React.SetStateAction<BoardType>>;
    pieceStatus: PieceStatusMap;
    setPieceStatus: React.Dispatch<React.SetStateAction<PieceStatusMap>>;
    dailyPuzzle: PuzzleData | null;
    setDailyPuzzle: React.Dispatch<React.SetStateAction<PuzzleData | null>>;
    puzzleLoaded: boolean;
    setPuzzleLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  }) {

    // Find piece coordinates on board and return normalized orientation + position
    function findPiecePosition(board: BoardType, pieceId: number): { 
        orientation: Coordinate[]; 
        position: { row: number; col: number } 
    } | null {
        const positions: Coordinate[] = [];
        
        // Find all positions where this piece exists
        for (let row = 0; row < BOARD_ROWS; row++) {
            for (let col = 0; col < BOARD_COLS; col++) {
                if (board[row][col] === pieceId) {
                    positions.push([row, col]);
                }
            }
        }
        
        if (positions.length === 0) return null;
        
        // Find the top-left corner (min row, min col)
        const minRow = Math.min(...positions.map(([r]) => r));
        const minCol = Math.min(...positions.map(([, c]) => c));
        
        // Normalize coordinates to [0,0] origin
        const orientation: Coordinate[] = positions.map(([row, col]) => [
            row - minRow, 
            col - minCol
        ]);
        
        return {
            orientation,
            position: { row: minRow, col: minCol }
        };
    }

    function startDailyPuzzle() {
        const puzzle = generateDailyPuzzle();
        setDailyPuzzle(puzzle);
        
        // Set the starting board
        setCurrentBoard(puzzle.startingBoard);
        
        // Update piece status map
        const newPieceStatus: PieceStatusMap = { ...pieceStatus };
        
        // Mark fixed pieces as on board and non-movable
        puzzle.fixedPieces.forEach(pieceId => {
            const pieceData = findPiecePosition(puzzle.startingBoard, pieceId);
            if (pieceData) {
                const newPieceState: PieceState = {
                    isOnBoard: true,
                    isSelected: false,
                    orientation: pieceData.orientation,
                    position: pieceData.position
                };
                newPieceStatus[pieceId] = newPieceState;
            }
        });
        
        // Reset removable pieces to not on board
        puzzle.removablePieces.forEach(pieceId => {
            const newPieceState: PieceState = {
                isOnBoard: false,
                isSelected: false,
                orientation: ALL_PIECES[pieceId].base,
                position: null
            };
            newPieceStatus[pieceId] = newPieceState;
        });
        
        setPieceStatus(newPieceStatus);
        setPuzzleLoaded(true);
    }

    function resetToTodaysPuzzle() {
        if (dailyPuzzle) {
            setCurrentBoard(dailyPuzzle.startingBoard);
        
            // Reset piece status to initial puzzle state
            const newPieceStatus: PieceStatusMap = { ...pieceStatus };
            
            // Restore fixed pieces
            dailyPuzzle.fixedPieces.forEach(pieceId => {
                const pieceData = findPiecePosition(dailyPuzzle.startingBoard, pieceId);
                if (pieceData) {
                    const newPieceState: PieceState = {
                        isOnBoard: true,
                        isSelected: false,
                        orientation: pieceData.orientation,
                        position: pieceData.position
                    };
                    newPieceStatus[pieceId] = newPieceState;
                }
            });
            
            // Reset removable pieces
            dailyPuzzle.removablePieces.forEach(pieceId => {
                const newPieceState: PieceState = {
                    isOnBoard: false,
                    isSelected: false,
                    orientation: ALL_PIECES[pieceId].base,
                    position: null
                };
                newPieceStatus[pieceId] = newPieceState;
            });
            
            setPieceStatus(newPieceStatus);
        }
    }

    function isPieceFixed(pieceId: number): boolean {
        return dailyPuzzle ? dailyPuzzle.fixedPieces.includes(pieceId) : false;
    }

    return {
        startDailyPuzzle,
        resetToTodaysPuzzle,
        isPieceFixed
    };
}