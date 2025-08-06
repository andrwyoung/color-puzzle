// this is the 5x11 board you see on the screen

import { CELL_SIZE } from "../lib/constants/ui";
import { getPieceColor } from "../lib/ui-helpers/get-piece-color";
import type { Board } from "../types/puzzle-types";

export default function GameBoard({ currentBoard }: { currentBoard: Board }) {
  return (
    <div className="grid grid-rows-5 grid-cols-11 w-fit bg-emerald-300 rounded-lg p-1">
      {currentBoard.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: getPieceColor(cell),
              borderRadius: 6 // Tailwind's `rounded-lg` is ~6px
            }}
            data-row={rowIndex}
            data-col={colIndex}
          />
        ))
      )}
    </div>
  );
}
