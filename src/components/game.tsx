// this is the game itself!
// it holds the board and the pieces, and how they all move around

import { useState } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../lib/constants/board-constants.ts";
import RandomizeButton from "./ui-components/randomize-button.tsx";
import ClearBoardButton from "./ui-components/clear-board-button.tsx";
import PieceContainer from "./piece-container.tsx";
import { DndContext } from "@dnd-kit/core";
import GameBoard from "./game-board.tsx";
import type { BoardType, PieceStatusMap } from "../types/puzzle-types.ts";
import { useDragHandlers } from "../hooks/drag-handlers.tsx";
import { ALL_PIECE_IDS } from "../lib/constants/piece-constants.ts";

export default function Board() {
  // this is the actual game board
  const [currentBoard, setCurrentBoard] = useState<BoardType>(() =>
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0))
  );

  // here's where we keep track of which pieces are on the board
  // TODO: actually use it
  const [pieceStatus, setPieceStatus] = useState<PieceStatusMap>(() =>
    Object.fromEntries(ALL_PIECE_IDS.map(id => [id, { isOnBoard: false, variation: null, position: null }]))
  );

  // this is a purely ui array
  const [highlightedCells, setHighlightedCells] = useState<boolean[][]>(() =>
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false))
  );

  const { onDragStart, onDragMove, onDragEnd } = useDragHandlers({
    setHighlightedCells,
    currentBoard,
    setCurrentBoard,
    pieceStatus,
    setPieceStatus
  });

  return (
    <DndContext onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd}>
      <div className="flex gap-x-4">
        <RandomizeButton setBoard={setCurrentBoard} />
        <ClearBoardButton setBoard={setCurrentBoard} setPieceStatus={setPieceStatus}/>
      </div>
      
      <GameBoard currentBoard={currentBoard} highlightedCells={highlightedCells} />

      <PieceContainer pieceStatus={pieceStatus} />
    </DndContext>
  );
}
