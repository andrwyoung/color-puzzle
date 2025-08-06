import type { Dispatch, SetStateAction } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../../lib/constants/board";
import type { Board } from "../../types/puzzle-types";

export default function RandomizeButton({ setBoard }: { setBoard: Dispatch<SetStateAction<Board>> }) {
  const randomizeBoard = () => {
    setBoard(() =>
      Array.from({ length: BOARD_ROWS }, () =>
        Array.from({ length: BOARD_COLS }, () => Math.floor(Math.random() * 12) + 1)
      )
    );
  };

  return (
    <button
      onClick={randomizeBoard}
      className="mb-2 px-4 py-2 text-lg font-header bg-emerald-400 text-white rounded 
      hover:bg-emerald-300 cursor-pointer"
    >
      Random Colors!!!!
    </button>
  );
}
