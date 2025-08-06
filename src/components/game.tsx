// this is the game itself!
// it holds the board and the pieces, and how they all move around

import { useState } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../lib/constants/board.ts";
import RandomizeButton from "./ui-components/randomize-button.tsx";
import PieceContainer from "./piece-container.tsx";
import { DndContext, type DragMoveEvent, type DragStartEvent } from "@dnd-kit/core";
import GameBoard from "./game-board.tsx";
import type { Board } from "../types/puzzle-types.ts";
import { CELL_SIZE } from "../lib/constants/ui.ts";

export default function Board() {
  // this is the actual game board
  const [currentBoard, setCurrentBoard] = useState<Board>(() =>
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0))
  );

  // this is a purely ui array
  const [highlightedCells, setHighlightedCells] = useState<boolean[][]>(() =>
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false))
  );

  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  // called when a piece starts being dragged.
  function onDragStart(event: DragStartEvent) {
    const mouseEvent = event.activatorEvent as MouseEvent;
    const boardEl = document.querySelector("[data-id='board']");
    if (!boardEl) return;

    const boardRect = boardEl.getBoundingClientRect();

    setDragPosition({
      x: mouseEvent.clientX - boardRect.left,
      y: mouseEvent.clientY - boardRect.top
    });
  }

  // called continuously as the piece is dragged around.
  function onDragMove(event: DragMoveEvent) {
    const { over } = event;

    // if we're not currently dragging over the board, clear all highlights.
    if (!over || over.id !== "board") {
      return setHighlightedCells(Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false)));
    }

    const boardEl = document.querySelector("[data-id='board']");
    if (!boardEl) return;

    // calculate pointer position based on movement
    const pointerX = event.delta.x + dragPosition.x;
    const pointerY = event.delta.y + dragPosition.y;

    // convert mouse position into board-relative position
    const relX = pointerX;
    const relY = pointerY;
    const colIndex = Math.floor(relX / CELL_SIZE);
    const rowIndex = Math.floor(relY / CELL_SIZE);

    console.log({
      relX,
      relY,
      colIndex,
      rowIndex
    });

    // guard against "out of bound" mouse positions
    if (rowIndex < 0 || rowIndex >= BOARD_ROWS || colIndex < 0 || colIndex >= BOARD_COLS) {
      return setHighlightedCells(Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false)));
    }

    // create new highlighted cells array
    const newHighlights = Array.from({ length: BOARD_ROWS }, (_, r) =>
      Array.from({ length: BOARD_COLS }, (_, c) => r === rowIndex && c === colIndex)
    );

    // update ui state
    setHighlightedCells(newHighlights);
  }

  return (
    <DndContext onDragStart={onDragStart} onDragMove={onDragMove}>
      <RandomizeButton setBoard={setCurrentBoard} />
      <GameBoard currentBoard={currentBoard} highlightedCells={highlightedCells} />

      <PieceContainer />
    </DndContext>
  );
}
