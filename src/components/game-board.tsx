// this is the 5x11 board you see on the screen

import { CELL_SIZE, DEFAULT_COLOR } from "../lib/constants/ui-constants";
import { ALL_PIECES } from "../lib/constants/piece-constants";
import type { BoardType, PieceStatusMap } from "../types/puzzle-types";
import { DroppableBoard } from "./drag-and-drop/droppable-board";
import { DraggablePiece } from "./drag-and-drop/draggable-piece";
import { getBoundingBox } from "../lib/ui-helpers/get-bounding-box";
import { Piece } from "./piece";

export default function GameBoard({
  currentBoard,
  highlightedCells,
  pieceStatus,
  selectedPieceId,
  onPieceSelect,
  isDragging
}: {
  currentBoard: BoardType;
  highlightedCells: boolean[][];
  pieceStatus: PieceStatusMap;
  selectedPieceId: number | null;
  onPieceSelect: (pieceId: number) => void;
  isDragging: boolean;
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

  return (
    <div className="relative">
      <DroppableBoard id="board">
        <div className="grid grid-rows-5 grid-cols-11 w-fit">
          {currentBoard.map((row, rowIndex) =>
            row.map((_, colIndex) => {
              const isHighlighted = highlightedCells?.[rowIndex]?.[colIndex];

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE
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
        const isSelected = (selectedPieceId === pieceId);

        const currentOrientation =state.orientation;
        const { width, height } = getBoundingBox(currentOrientation);

        return (
          <div
            key={`board-piece-${pieceId}`}
            className={`absolute ${isSelected ? 'pointer-events-none z-50' : 'pointer-events-none'} ${isSelected ? 'z-30' : 'z-20'}`}
            style={{
              top: (state.position!.row * CELL_SIZE) + 11,
              left: (state.position!.col * CELL_SIZE) + 11,
            }}
          >
            <DraggablePiece 
              id={id} 
              pieceId={pieceId}
              key={id}
            >
              <div
                className={`relative ${isSelected ? 'pointer-events-none' : (selectedPieceId != null ? 'pointer-events-none' : 'pointer-events-auto')} `}
                style={{
                  width: width * CELL_SIZE,
                  height: height * CELL_SIZE
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
                />
              </div>
            </DraggablePiece>
          </div>
        );
      })}

    </div>
  );
}
