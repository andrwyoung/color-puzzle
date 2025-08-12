// this is the 5x11 board you see on the screen

import { CELL_SIZE, DEFAULT_COLOR } from "../lib/constants/ui-constants";
import { getPieceColor } from "../lib/ui-helpers/get-piece-color";
import type { BoardType } from "../types/puzzle-types";
import { DroppableBoard } from "./drag-and-drop/droppable-board";

export default function GameBoard({
  currentBoard,
  highlightedCells
}: {
  currentBoard: BoardType;
  highlightedCells: boolean[][];
}) {
  return (
    <DroppableBoard id="board">
      <div className="grid grid-rows-5 grid-cols-11 w-fit">
        {currentBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isHighlighted = highlightedCells?.[rowIndex]?.[colIndex];
            const pieceColor = getPieceColor(cell);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  color: pieceColor
                  // border: isHighlighted ? "2px solid #FACC15" : "none" // Tailwind's yellow-400
                }}
                className={`flex items-center justify-center ${
                  isHighlighted ? "border-2 border-white/15 rounded-sm" : ""
                }`}
                data-row={rowIndex}
                data-col={colIndex}
              >
                {pieceColor === DEFAULT_COLOR ? (
                  <>
                    {isHighlighted ? (
                      <div className="w-3/8 h-3/8 rotate-45 rounded-md" style={{ backgroundColor: DEFAULT_COLOR }} />
                    ) : (
                      <div className="w-1/8 h-1/8 rotate-45 rounded-md" style={{ backgroundColor: DEFAULT_COLOR }} />
                    )}
                  </>
                ) : (
                  <div className="w-5/8 h-5/8 rotate-45 rounded-lg" style={{ backgroundColor: pieceColor }}></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </DroppableBoard>
  );
}
