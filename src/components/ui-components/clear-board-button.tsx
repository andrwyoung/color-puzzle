// for testing: clears the board entirely

import type { Dispatch, SetStateAction } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../../lib/constants/board-constants";
import type { BoardType } from "../../types/puzzle-types";
import type { Coordinate, PieceState, PieceStatusMap } from "../../types/puzzle-types";
import { ALL_PIECES } from "../../lib/constants/piece-constants";

export default function ClearBoardButton({ 
    setBoard,
    setPieceStatus 
}: { 
    setBoard: Dispatch<SetStateAction<BoardType>>;
    setPieceStatus: Dispatch<SetStateAction<PieceStatusMap>>;
}) {
  const clearBoard = () => {
    setBoard(() =>
        Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0))
    );

    setPieceStatus(prev =>
        Object.fromEntries(
            Object.keys(prev).map(id => {
                const baseOrientation: Coordinate[] = ALL_PIECES[+id].base
                const newPieceState: PieceState = {
                    isOnBoard: false,
                    isSelected: false,
                    orientation: baseOrientation,
                    position: null
                };
                return [+id, newPieceState];
            })
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