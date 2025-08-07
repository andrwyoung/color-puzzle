// this is the game itself!
// it holds the board and the pieces, and how they all move around

import { useState } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../lib/constants/board-constants.ts";
import RandomizeButton from "./ui-components/randomize-button.tsx";
import PieceContainer from "./piece-container.tsx";
import { DndContext, type DragEndEvent, type DragMoveEvent, type DragStartEvent } from "@dnd-kit/core";
import GameBoard from "./game-board.tsx";
import type { BoardType } from "../types/puzzle-types.ts";
import { CELL_SIZE } from "../lib/constants/ui-constants.ts";
import { canPlacePiece } from "../lib/ui-helpers/can-place-piece.tsx";

export default function Board() {
  // this is the actual game board
  const [currentBoard, setCurrentBoard] = useState<BoardType>(() =>
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0))
  );

  // this is a purely ui array
  const [highlightedCells, setHighlightedCells] = useState<boolean[][]>(() =>
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false))
  );

  // where the mouse currently is
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  // the difference between where you clicked on the piece and the piece's top left
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // HELPER: to deterimine which cell we're "over" depending on the mouse position
  function getDropCellFromEvent(event: DragMoveEvent | DragEndEvent) {
    // calculate pointer position based on movement
    const pointerX = event.delta.x + dragPosition.x;
    const pointerY = event.delta.y + dragPosition.y;

    // convert mouse position into board-relative position
    const relX = pointerX - dragOffset.x;
    const relY = pointerY - dragOffset.y;

    // return which cell it lands in
    return {
      colIndex: Math.floor(relX / CELL_SIZE),
      rowIndex: Math.floor(relY / CELL_SIZE)
    };
  }

  // called when a piece starts being dragged.
  function onDragStart(event: DragStartEvent) {
    const mouseEvent = event.activatorEvent as MouseEvent;

    const pieceEl = document.querySelector(`[data-id='${event.active.id}']`);
    const boardEl = document.querySelector("[data-id='board']");
    if (!pieceEl || !boardEl) return;

    // grab the info about the piece you're holding an the board
    const pieceRect = pieceEl.getBoundingClientRect();
    const boardRect = boardEl.getBoundingClientRect();

    // how far the mouse is from the MIDDLE of the top-left "cell" of the piece
    const cellCenterX = CELL_SIZE / 2;
    const cellCenterY = CELL_SIZE / 2;
    const offsetX = mouseEvent.clientX - (pieceRect.left + cellCenterX);
    const offsetY = mouseEvent.clientY - (pieceRect.top + cellCenterY);

    // where the piece is relative to the board
    const dragX = mouseEvent.clientX - boardRect.left;
    const dragY = mouseEvent.clientY - boardRect.top;

    setDragOffset({ x: offsetX, y: offsetY });
    setDragPosition({ x: dragX, y: dragY });
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

    // which cell are we in?
    const { rowIndex, colIndex } = getDropCellFromEvent(event);

    // debug
    // console.log({
    //   relX,
    //   relY,
    //   colIndex,
    //   rowIndex
    // });

    // guard against "out of bound" mouse positions
    if (rowIndex < 0 || rowIndex >= BOARD_ROWS || colIndex < 0 || colIndex >= BOARD_COLS) {
      return setHighlightedCells(Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false)));
    }

    // create new highlighted cells array
    const variation = event.active.data.current?.variation;
    if (!variation) return;

    // if a piece can't be placed, just exit
    if (!canPlacePiece(currentBoard, variation, rowIndex, colIndex)) {
      return setHighlightedCells(Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false)));
    }

    // generate the highlight mask only *after* checking it's placeable
    const newHighlights = Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false));
    for (const [dy, dx] of variation) {
      const r = rowIndex + dy;
      const c = colIndex + dx;
      newHighlights[r][c] = true;
    }
    setHighlightedCells(newHighlights);
  }

  function onDragEnd(event: DragEndEvent) {
    const variation = event.active.data.current?.variation;
    const pieceId = event.active.data.current?.pieceId;
    const boardEl = document.querySelector("[data-id='board']");

    if (!variation || !pieceId || !boardEl) return;

    // which cell are we in?
    const { rowIndex, colIndex } = getDropCellFromEvent(event);
    // check bounds again
    const isPlaceable = canPlacePiece(currentBoard, variation, rowIndex, colIndex);

    // only place the piece if it's valid
    if (isPlaceable) {
      const updatedBoard = currentBoard.map(row => [...row]); // clone
      for (const [dy, dx] of variation) {
        const r = rowIndex + dy;
        const c = colIndex + dx;
        updatedBoard[r][c] = pieceId;
      }
      console.log(updatedBoard);

      setCurrentBoard(updatedBoard);
    }

    // clear highlight regardless
    setHighlightedCells(Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false)));
  }

  return (
    <DndContext onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd}>
      <RandomizeButton setBoard={setCurrentBoard} />
      <GameBoard currentBoard={currentBoard} highlightedCells={highlightedCells} />

      <PieceContainer />
    </DndContext>
  );
}
