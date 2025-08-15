import { useState } from "react";
import { BOARD_ROWS, BOARD_COLS } from "../lib/constants/board-constants";
import { CELL_SIZE } from "../lib/constants/ui-constants";
import { canPlacePiece } from "../lib/ui-helpers/can-place-piece";
import type { BoardType, PieceState, PieceStatusMap } from "../types/puzzle-types";
import type { DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core";

export function useDragHandlers({
  currentBoard,
  setCurrentBoard,
  setHighlightedCells,
  pieceStatus,
  setPieceStatus,
  setIsDragging,
  selectedPieceId,
  setSelectedPieceId
}: {
  currentBoard: BoardType;
  setCurrentBoard: React.Dispatch<React.SetStateAction<BoardType>>;
  setHighlightedCells: React.Dispatch<React.SetStateAction<boolean[][]>>;
  pieceStatus: PieceStatusMap;
  setPieceStatus: React.Dispatch<React.SetStateAction<PieceStatusMap>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPieceId: number | null;
  setSelectedPieceId: React.Dispatch<React.SetStateAction<number | null>>;
}) {
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

    setIsDragging(true);
    setDragOffset({ x: offsetX, y: offsetY });
    setDragPosition({ x: dragX, y: dragY });
  }

  // called continuously as the piece is dragged around.
  function onDragMove(event: DragMoveEvent) {
    const { over } = event;

    // if we're not currently dragging over the board, clear all highlights.
    if (!over || over.id !== "board") {
      return clearHighlights();
    }

    const boardEl = document.querySelector("[data-id='board']");
    if (!boardEl) return;

    // which cell are we in?
    const { rowIndex, colIndex } = getDropCellFromEvent(event);

    // guard against "out of bound" mouse positions
    if (rowIndex < 0 || rowIndex >= BOARD_ROWS || colIndex < 0 || colIndex >= BOARD_COLS) {
      return clearHighlights();
    }

    // create new highlighted cells array
    const pieceId = event.active.data.current?.pieceId;
    const orientation = pieceStatus[pieceId].orientation;

    // if a piece can't be placed, just exit
    if (!canPlacePiece(currentBoard, orientation, rowIndex, colIndex)) {
      return clearHighlights();
    }

    // generate the highlight mask only *after* checking it's placeable
    const newHighlights = Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false));
    for (const [dy, dx] of orientation) {
      newHighlights[rowIndex + dy][colIndex + dx] = true;
    }
    setHighlightedCells(newHighlights);
  }

  function onDragEnd(event: DragEndEvent) {
    setIsDragging(false);

    const pieceId = event.active.data.current?.pieceId;
    const orientation = pieceStatus[pieceId].orientation;

    const boardEl = document.querySelector("[data-id='board']");

    if (!pieceId || !boardEl) {
      console.error("Missing drag drop data");
      return;
    }

    // which cell are we in?
    const { rowIndex, colIndex } = getDropCellFromEvent(event);
    // check bounds again
    const isPlaceable = canPlacePiece(currentBoard, orientation, rowIndex, colIndex);

    // only place the piece if it's valid
    if (isPlaceable) {
      const updatedBoard = currentBoard.map(row => [...row]); // clone
      for (const [dy, dx] of orientation) {
        updatedBoard[rowIndex + dy][colIndex + dx] = pieceId;
      }
      console.log(updatedBoard);

      // update the piece placement metadata
      const newPieceState: PieceState = {
        isOnBoard: true,
        orientation: orientation,
        position: { row: rowIndex, col: colIndex }
      };

      setPieceStatus(prev => ({
        ...prev,
        [pieceId]: newPieceState
      }));

      setCurrentBoard(updatedBoard);
    }

    // clear highlight regardless
    clearHighlights();
  }

  function clearHighlights() {
    setHighlightedCells(Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false)));
  }

  return {
    dragPosition,
    dragOffset,
    currentBoard,
    selectedPieceId,
    setCurrentBoard,
    onDragStart,
    onDragMove,
    onDragEnd
  };
}
