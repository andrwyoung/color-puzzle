import { useState } from "react";
import { BOARD_ROWS, BOARD_COLS } from "../lib/constants/board-constants";
import { CELL_SIZE } from "../lib/constants/ui-constants";
import { canPlacePiece } from "../lib/ui-helpers/can-place-piece";
import { removePieceFromBoard } from "../lib/ui-helpers/board-utils";
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
  // storing the original state in case need to restore
  const [originalPieceState, setOriginalPieceState] = useState<PieceState | null>(null);

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

  function clearHighlights() {
    setHighlightedCells(Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false)));
  }

  // Helper to send piece to container
  function sendPieceToContainer(pieceId: number, orientation: any[]) {
    const newPieceState: PieceState = {
      isOnBoard: false,
      orientation: orientation,
      position: null
    };

    setPieceStatus(prev => ({
      ...prev,
      [pieceId]: newPieceState
    }));

    const updatedBoard = removePieceFromBoard(currentBoard, pieceId);
    setCurrentBoard(updatedBoard);
  }

  // Helper to place piece on board
  function placePieceOnBoard(pieceId: number, orientation: any[], rowIndex: number, colIndex: number) {
    const updatedBoard = removePieceFromBoard(currentBoard, pieceId)

    for (const [dy, dx] of orientation) {
      updatedBoard[rowIndex + dy][colIndex + dx] = pieceId;
    }

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

  // FUNCTION: called when a piece starts being dragged.
  function onDragStart(event: DragStartEvent) {
    console.log("🚀 DRAG START:");
    console.log("  - event.active.id:", event.active.id);
    console.log("  - event.active.data:", event.active.data.current);

    const pieceEl = document.querySelector(`[data-id='${event.active.id}']`) || event.activatorEvent.target as HTMLElement;
    const boardEl = document.querySelector("[data-id='board']");
    const containerEl = document.querySelector("[data-id='piece-container']");
    const allDroppables = document.querySelectorAll('[data-dnd-kit-droppable]');

    console.log('🔍 Droppables at drag start:', {
      boardEl: !!boardEl,
      containerEl: !!containerEl,
      allDroppables: allDroppables.length,
      boardHasDndAttr: boardEl?.hasAttribute('data-dnd-kit-droppable'),
      containerHasDndAttr: containerEl?.hasAttribute('data-dnd-kit-droppable')
    });

    if (!pieceEl || !boardEl ) return;

    const mouseEvent = event.activatorEvent as MouseEvent;
    const pieceId = event.active.data.current?.pieceId;

    if (!pieceId || !pieceStatus[pieceId]) {
      return;
    }

    const isFromBoard = pieceStatus[pieceId].isOnBoard;
    console.log("piece from board:", isFromBoard, "piece id:", pieceId);

    // select the piece being dragged, and store the original state just in case
    setSelectedPieceId(pieceId)
    setOriginalPieceState({ ...pieceStatus[pieceId] })

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

    console.log("🔍 DndKit context at start:", {
      droppableContainers: document.querySelectorAll('[data-dnd-kit-droppable]').length,
      boardElement: document.querySelector("[data-id='board']"),
      boardHasDroppableAttr: document.querySelector("[data-id='board']")?.hasAttribute('data-dnd-kit-droppable')
    })

    setIsDragging(true);
    setDragOffset({ x: offsetX, y: offsetY });
    setDragPosition({ x: dragX, y: dragY });
  }

  // FUNCTION: called continuously as the piece is dragged around.
  function onDragMove(event: DragMoveEvent) {
    const { over } = event;
    console.log("🎯 onDragMove - over:", over?.id, "active:", event.active.id);

    // Add detailed debugging
    console.log("🔍 Event details:", {
      overData: over?.data?.current,
      overRect: over?.rect,
      activatorEvent: event.activatorEvent,
      delta: event.delta
    });


    const activeElement = document.querySelector(`[data-id='${event.active.id}']`);
    const boardElement = document.querySelector(`[data-id='board']`);
    const allDroppables = document.querySelectorAll('[data-dnd-kit-droppable]');
    console.log("🔍 Elements check:", {
      activeExists: !!activeElement,
      boardExists: !!boardElement,
      activeId: event.active.id,
      droppableCount: allDroppables.length,
      droppableIds: Array.from(allDroppables).map(el => el.getAttribute('data-dnd-kit-droppable-id'))
    });

    // clear highlights if not over board
    if (!over || over.id !== "board") {
      return clearHighlights();
    }

    const { rowIndex, colIndex } = getDropCellFromEvent(event);

    // guard against "out of bound" mouse positions
    if (rowIndex < 0 || rowIndex >= BOARD_ROWS || colIndex < 0 || colIndex >= BOARD_COLS) {
      return clearHighlights();
    }

    // get current info
    const pieceId = event.active.data.current?.pieceId;
    const currentPieceState = pieceStatus[pieceId] || originalPieceState;

    if (!pieceId || !currentPieceState) return;
    
    const orientation = currentPieceState.orientation;

    // use a temporary board for collision checking
    let tempBoard = removePieceFromBoard(currentBoard, pieceId);

    // if a piece can't be placed, just exit
    if (!canPlacePiece(tempBoard, orientation, rowIndex, colIndex)) {
      return clearHighlights();
    }

    // generate the highlight mask only *after* checking it's placeable
    const newHighlights = Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(false));
    for (const [dy, dx] of orientation) {
      newHighlights[rowIndex + dy][colIndex + dx] = true;
    }
    setHighlightedCells(newHighlights);
  }

  // FUNCTION: what to do when drag ends
  function onDragEnd(event: DragEndEvent) {
    console.log("drag end:", event.over?.id);
    setIsDragging(false);
    
    const { over } = event;
    const pieceId = event.active.data.current?.pieceId;
    const currentPieceState = pieceStatus[pieceId] || originalPieceState;

    if (!pieceId || !currentPieceState) {
      clearHighlights();
      return;
    }

    const orientation = currentPieceState.orientation;

    if (over?.id === "board") {

      const { rowIndex, colIndex } = getDropCellFromEvent(event);

      let tempBoard = removePieceFromBoard(currentBoard, pieceId);
      const isPlaceable = canPlacePiece(tempBoard, orientation, rowIndex, colIndex);

      // only place the piece if it's valid
      if (isPlaceable) {
        placePieceOnBoard(pieceId, orientation, rowIndex, colIndex);
        setSelectedPieceId(null);
        return;
      } else {
        sendPieceToContainer(pieceId, orientation);
      }
    }

    // handle intentionally returned piece to container
    if (over?.id === "piece-container") {
      sendPieceToContainer(pieceId, orientation);
    }

    // edge cases
    if (!over || (over.id !== "board" && over.id !== "piece-container")) {
      sendPieceToContainer(pieceId, orientation);
    }

    clearHighlights();
    setOriginalPieceState(null);
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