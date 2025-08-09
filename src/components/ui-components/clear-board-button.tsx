// for testing: clears the board entirely

import type { Dispatch, SetStateAction } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../../lib/constants/board-constants";
import type { BoardType } from "../../types/puzzle-types";
import { ALL_PIECES } from "../../lib/constants/piece-constants";
import type { PieceStatusMap } from "../../types/puzzle-types";

export default function ClearBoardButton({ 
    setBoard, 
    setPieceStatus
}: { 
    setBoard: Dispatch<SetStateAction<BoardType>>;
    setPieceStatus: Dispatch<SetStateAction<PieceStatusMap>>;
 }) {

    const clearBoard = () => {
        // set board values to 0
        setBoard(() =>
            Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0))
        );

        // reset the piece status map
        setPieceStatus(prev =>
            Object.fromEntries(
                Object.keys(prev).map(id => [
                    +id,
                    {
                        isOnBoard: false,
                        variation: ALL_PIECES[+id].base,
                        position: null
                    }
                ])
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
