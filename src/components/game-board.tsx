// this is the 5x11 board you see on the screen

import { DEFAULT_COLOR } from "../lib/constants/ui-constants";
import { ALL_PIECES } from "../lib/constants/piece-constants";
import type { BoardType, PieceStatusMap, PuzzleData } from "../types/puzzle-types";
import { DroppableBoard } from "./drag-and-drop/droppable-board";
import { DraggablePiece } from "./drag-and-drop/draggable-piece";
import { getBoundingBox } from "../lib/ui-helpers/get-bounding-box";
import { Piece } from "./piece";
import { useEffect, useRef, useState } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../lib/constants/board-constants";

export default function GameBoard({
  currentBoard,
  highlightedCells,
  pieceStatus,
  selectedPieceId,
  onPieceSelect,
  isDragging,
  cellSize,
  puzzleData
}: {
  currentBoard: BoardType;
  highlightedCells: boolean[][];
  pieceStatus: PieceStatusMap;
  selectedPieceId: number | null;
  onPieceSelect: (pieceId: number) => void;
  isDragging: boolean;
  cellSize: number;
  puzzleData: PuzzleData | null;
}) {
  const piecesOnBoard = pieceStatus
    ? Object.entries(pieceStatus)
        .filter(([, state]) => state?.isOnBoard && state?.position)
        .map(([id, state]) => ({
          id: id,
          pieceId: +id,
          state
        }))
    : [];

  const boardRef = useRef<HTMLDivElement | null>(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  // measure the current board size responsively
  useEffect(() => {
    if (!boardRef.current) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setBoardSize({ width, height });
      }
    });

    observer.observe(boardRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boardRef} className="relative">
      <DroppableBoard id="board" cellSize={cellSize}>
        <div className="grid grid-rows-5 grid-cols-11 w-fit">
          {currentBoard.map((row, rowIndex) =>
            row.map((_, colIndex) => {
              const isHighlighted = highlightedCells?.[rowIndex]?.[colIndex];

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: cellSize,
                    height: cellSize
                  }}
                  className={`flex items-center justify-center ${
                    isHighlighted ? "border-2 border-white/15 rounded-sm" : ""
                  }`}
                  data-row={rowIndex}
                  data-col={colIndex}
                >
                  {isHighlighted ? (
                    <div className="w-3/8 h-3/8 rotate-45 rounded-md" style={{ backgroundColor: DEFAULT_COLOR }} />
                  ) : (
                    <div className="w-1/8 h-1/8 rotate-45 rounded-md" style={{ backgroundColor: DEFAULT_COLOR }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </DroppableBoard>

      {piecesOnBoard.map(({ id, pieceId, state }) => {
        const isSelected = selectedPieceId === pieceId;

        const currentOrientation = state.orientation;
        const { width, height } = getBoundingBox(currentOrientation);

        return (
          <div
            key={`board-piece-${pieceId}`}
            className={`absolute ${isSelected ? "pointer-events-none z-50" : "pointer-events-none"} ${
              isSelected ? "z-30" : "z-20"
            }`}
            style={{
              top: (boardSize.height / BOARD_ROWS) * state.position!.row,
              left: (boardSize.width / BOARD_COLS) * state.position!.col
            }}
          >
            <DraggablePiece id={id} pieceId={pieceId} key={id} cellSize={cellSize} puzzleData={puzzleData}>
              <div
                className={`relative ${
                  isSelected
                    ? "pointer-events-none"
                    : selectedPieceId != null
                    ? "pointer-events-none"
                    : "pointer-events-auto"
                } `}
                style={{
                  width: width * cellSize,
                  height: height * cellSize
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                  onPieceSelect(pieceId);
                }}
              >
                <Piece
                  base={state.orientation}
                  anchor={[0, 0]}
                  color={ALL_PIECES[pieceId].color}
                  isSelected={isSelected}
                  isDragging={isDragging}
                  cellSize={cellSize}
                />
              </div>
            </DraggablePiece>
          </div>
        );
      })}
    </div>
  );
}
