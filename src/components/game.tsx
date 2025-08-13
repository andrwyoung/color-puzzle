// this is the game itself!
// it holds the board and the pieces, and how they all move around

import { useEffect, useState } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../lib/constants/board-constants.ts";
import { ALL_PIECES, ALL_PIECE_IDS } from "../lib/constants/piece-constants.ts";
import ClearBoardButton from "./ui-components/clear-board-button.tsx";
import { DndContext } from "@dnd-kit/core";
import GameBoard from "./game-board.tsx";
import type { BoardType, PieceStatusMap } from "../types/puzzle-types.ts";
import { useDragHandlers } from "../hooks/drag-handlers.tsx";
import { useSelectionHandlers } from "../hooks/piece-selection-handlers.tsx";
import PieceContainer from "./piece-container.tsx";
import { CELL_SIZE } from "../lib/constants/ui-constants.ts";
import { FaHourglassHalf } from "react-icons/fa6";

export default function Board() {
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

  const [isDragging, setIsDragging] = useState(false);
  const { onDragStart, onDragMove, onDragEnd } = useDragHandlers({
    setHighlightedCells,
    currentBoard,
    setCurrentBoard,
    pieceStatus,
    setPieceStatus,
    setIsDragging
  });

  const { handlePieceSelect, handleDeselectAll } = useSelectionHandlers({
    pieceStatus,
    setPieceStatus
  });

  // const { rotateSelectedClockwise, rotateSelectedCounterclockwise, flipSelectedHorizontally, flipSelectedVertically } =
  //   usePieceManipulation({
  //     pieceStatus,
  //     setPieceStatus
  //   });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const dataId = target.closest("[data-id]")?.getAttribute("data-id") || "";

      if (!dataId.includes("piece-")) {
        handleDeselectAll();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleDeselectAll]);

  return (
    <DndContext onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd}>
      <div className="flex flex-col w-10/12 h-full justify-items-center items-center p-4 gap-4">
        <div className="flex justify-between gap-8 items-end" style={{ width: CELL_SIZE * BOARD_COLS }}>
          <div className="flex flex-col gap-2 items-left text-text">
            <h1 className="text-4xl font-header font-normal">Color Puzzle Game</h1>
            <p className="font-body">
              Drag the pieces to fill the whole board. <br />
              Come back daily for a new puzzle!
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <p className="text-text font-body flex items-center gap-1">
              <FaHourglassHalf /> 0:00
            </p>
            <ClearBoardButton setBoard={setCurrentBoard} setPieceStatus={setPieceStatus} />
          </div>
        </div>

        <div className="flex gap-x-8">
          <GameBoard currentBoard={currentBoard} highlightedCells={highlightedCells} />
        </div>
        <div className="pt-8">
          <PieceContainer
            isDragging={isDragging}
            pieceStatus={pieceStatus}
            setPieceStatus={setPieceStatus}
            onPieceSelect={handlePieceSelect}
          />
        </div>
      </div>
    </DndContext>
  );
}
