import { useState } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../types/board";
import { getPieceColor } from "../lib/ui-helpers/get-piece-color";
import { CELL_SIZE } from "../lib/constants/ui";

export default function Board() {
  const [currentBoard, setCurrentBoard] = useState<(number | null)[][]>(() =>
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null))
  );

  const randomizeBoard = () => {
    setCurrentBoard(() =>
      Array.from({ length: BOARD_ROWS }, () =>
        Array.from(
          { length: BOARD_COLS },
          () => Math.floor(Math.random() * 12) + 1
        )
      )
    );
  };

  return (
    <>
      <button
        onClick={randomizeBoard}
        className="mb-2 px-4 py-2 text-lg font-header bg-emerald-400 text-white rounded 
        hover:bg-emerald-300 cursor-pointer"
      >
        Random Colors!!!!
      </button>
      <div className="grid grid-rows-5 grid-cols-11 w-fit bg-emerald-300 rounded-lg p-1">
        {currentBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: getPieceColor(cell),
                borderRadius: 6, // Tailwind's `rounded-lg` is ~6px
              }}
              data-row={rowIndex}
              data-col={colIndex}
            />
          ))
        )}
      </div>
    </>
  );
}
