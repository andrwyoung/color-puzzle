// this is the 5x11 board you see on the screen

import { CELL_SIZE } from "../lib/constants/ui-constants";
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

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: getPieceColor(cell),
                  borderRadius: 6,
                  border: isHighlighted ? "2px solid #FACC15" : "none" // Tailwind's yellow-400
                }}
                data-row={rowIndex}
                data-col={colIndex}
              />
            );
          })
        )}
      </div>
    </DroppableBoard>
  );
}
