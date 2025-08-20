// this is the game itself!
// it holds the board and the pieces, and how they all move around

import { useEffect, useState } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../lib/constants/board-constants.ts";
import { ALL_PIECES, ALL_PIECE_IDS } from "../lib/constants/piece-constants.ts";
import Button from "./ui-components/styled-button.tsx";
import { DndContext } from "@dnd-kit/core";
import GameBoard from "./game-board.tsx";
import type { BoardType, PieceStatusMap, PuzzleData } from "../types/puzzle-types.ts";
import { useDragHandlers } from "../hooks/drag-handlers.tsx";
import { useSelectionHandlers } from "../hooks/piece-selection-handlers.tsx";
import { useDailyPuzzle } from "../hooks/daily-puzzle-handlers.tsx";
import { useResponsiveCellSize } from "../hooks/useResponsiveCellSize.tsx";
import PieceContainer from "./piece-container.tsx";
import { FaHourglassHalf } from "react-icons/fa6";
import { useTimer } from "../hooks/use-timer.tsx";

export default function Board() {
  const { cellSize, scaleContainer } = useResponsiveCellSize();
  // this is the actual game board
  const [currentBoard, setCurrentBoard] = useState<BoardType>(() =>
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0))
  );

  // here's where we keep track of which pieces are on the board
  const [pieceStatus, setPieceStatus] = useState<PieceStatusMap>(() =>
    Object.fromEntries(
      ALL_PIECE_IDS.map(id => [
        id,
        { isOnBoard: false, isSelected: false, orientation: ALL_PIECES[id].base, position: null }
      ])
    )
  );

  // this is a purely ui array
  const [highlightedCells, setHighlightedCells] = useState<boolean[][]>(() =>
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false))
  );

  // for selected pieces
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);

  // daily puzzle state
  const [dailyPuzzle, setDailyPuzzle] = useState<PuzzleData | null>(null);
  const [puzzleLoaded, setPuzzleLoaded] = useState(false);

  // handlers
  const [isDragging, setIsDragging] = useState(false);
  const { onDragStart, onDragMove, onDragEnd } = useDragHandlers({
    setHighlightedCells,
    currentBoard,
    setCurrentBoard,
    pieceStatus,
    setPieceStatus,
    setIsDragging,
    selectedPieceId,
    setSelectedPieceId,
    cellSize
  });

  const { selectPiece, deselectAll } = useSelectionHandlers({
    selectedPieceId,
    setSelectedPieceId
  });

  const { getFormattedTime, startTimer, resetTimer } = useTimer();

  const { startDailyPuzzle, resetToTodaysPuzzle } = useDailyPuzzle({
    setCurrentBoard,
    pieceStatus,
    setPieceStatus,
    dailyPuzzle,
    setDailyPuzzle,
    puzzleLoaded,
    setPuzzleLoaded,
    startTimer,
    resetTimer
  });

  // global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "r") {
        e.preventDefault();
        if (puzzleLoaded) resetToTodaysPuzzle();
        else startDailyPuzzle();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [startDailyPuzzle, resetToTodaysPuzzle, puzzleLoaded]);

  // const { rotateSelectedClockwise, rotateSelectedCounterclockwise, flipSelectedHorizontally, flipSelectedVertically } =
  //   usePieceManipulation({
  //     pieceStatus,
  //     setPieceStatus
  //   });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isDragging) return;

      const target = e.target as HTMLElement;
      const dataId = target.closest("[data-id]")?.getAttribute("data-id") || "";

      if (!dataId.includes("piece-")) {
        deselectAll();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deselectAll, isDragging]);

  return (
    <DndContext onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd}>
      <div className="flex flex-col w-full max-w-6xl mx-auto h-full justify-items-center items-center p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden">
        <div
          className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-8 items-center sm:items-end w-full"
          style={{ maxWidth: cellSize * BOARD_COLS }}
        >
          <div className="flex flex-col gap-2 items-left text-text">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-header font-normal text-center sm:text-left">
              Color Puzzle Game
            </h1>
            <p className="font-body text-sm sm:text-base text-center sm:text-left">
              Click pieces to flip and rotate. Drag to fill the whole board. <br />
              Come back daily for a new puzzle!
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="text-primary flex items-center gap-1 text-sm font-body sm:text-base ">
              <FaHourglassHalf />
              <p>{getFormattedTime()}</p>
            </div>

            {!puzzleLoaded ? (
              <Button onClick={startDailyPuzzle} title="Start Today's Puzzle (R)">
                <span className="text-sm sm:text-base">Start Today's Puzzle</span>
              </Button>
            ) : (
              <Button onClick={resetToTodaysPuzzle} title="Reset Puzzle (R)">
                <span className="text-sm sm:text-base">Reset Puzzle</span>
              </Button>
            )}
          </div>
        </div>

        <div
          className="flex justify-center w-full p-4"
          style={{ transform: scaleContainer, transformOrigin: "center top" }}
        >
          <div className="flex gap-x-4 sm:gap-x-8">
            <GameBoard
              currentBoard={currentBoard}
              highlightedCells={highlightedCells}
              pieceStatus={pieceStatus}
              selectedPieceId={selectedPieceId}
              onPieceSelect={selectPiece}
              isDragging={isDragging}
              cellSize={cellSize}
            />
          </div>
        </div>
        <div
          className="pt-4 w-full flex justify-center"
          style={{ transform: scaleContainer, transformOrigin: "center top" }}
        >
          <PieceContainer
            pieceStatus={pieceStatus}
            setPieceStatus={setPieceStatus}
            selectedPieceId={selectedPieceId}
            deselectAll={deselectAll}
            onPieceSelect={selectPiece}
            isDragging={isDragging}
            cellSize={cellSize}
          />
        </div>
      </div>
    </DndContext>
  );
}
