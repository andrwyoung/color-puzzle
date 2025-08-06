// this is the game itself!
// it holds the board and the pieces, and how they all move around

import { useState } from "react";
import { BOARD_COLS, BOARD_ROWS } from "../lib/constants/board.ts";
import RandomizeButton from "./ui-components/randomize-button.tsx";
import PieceContainer from "./piece-container.tsx";
import { DndContext } from "@dnd-kit/core";
import GameBoard from "./board.tsx";
import type { Board } from "../types/puzzle-types.ts";

export default function Board() {
  const [currentBoard, setCurrentBoard] = useState<Board>(() =>
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0))
  );

  return (
    <DndContext>
      <RandomizeButton setBoard={setCurrentBoard} />
      <GameBoard currentBoard={currentBoard} />

      <PieceContainer />
    </DndContext>
  );
}
