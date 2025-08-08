// for testing: clears the board entirely

import type { Dispatch, SetStateAction } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../../lib/constants/board-constants";
import type { BoardType } from "../../types/puzzle-types";

export default function ClearBoardButton({ setBoard }: { setBoard: Dispatch<SetStateAction<BoardType>> }) {
  const clearBoard = () => {
    setBoard(() =>
      Array.from({ length: BOARD_ROWS }, () =>
        Array.from({ length: BOARD_COLS }, () => 0)
      )
    );
  };

  return (
    <button
      onClick={clearBoard}
      className="mb-2 px-4 py-2 text-lg font-header bg-emerald-400 text-white rounded 
      hover:bg-emerald-300 cursor-pointer"
    >
      Clear Board
    </button>
  );
}
