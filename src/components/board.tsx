// this is the board, as well as the pieces that are not on the board yet

import { useState } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../lib/constants/board.ts";
import { getPieceColor } from "../lib/ui-helpers/get-piece-color";
import { CELL_SIZE } from "../lib/constants/ui";
import RandomizeButton from "./ui-components/randomize-button.tsx";
import PieceContainer from "./piece-container.tsx";

export default function Board() {
  const [currentBoard, setCurrentBoard] = useState<(number | null)[][]>(() =>
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null))
  );

  return (
    <>
      <RandomizeButton setBoard={setCurrentBoard} />
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

      <PieceContainer />
    </>
  );
}
