// this is the rectangle that "holds" the pieces when they are not
// yet placed on the board

import { ALL_PIECES } from "../lib/constants/piece-constants";
import { CELL_SIZE } from "../lib/constants/ui-constants";
import { getBoundingBox } from "../lib/ui-helpers/get-bounding-box";
import type { PieceStatusMap } from "../types/puzzle-types";
import { DraggablePiece } from "./drag-and-drop/draggable-piece";
import { Piece } from "./piece";

export default function PieceContainer({ pieceStatus }: { pieceStatus: PieceStatusMap }) {
  return (
    <div className="flex flex-wrap gap-4 bg-gray-100 p-4">
      {Object.entries(ALL_PIECES).map(([id, piece]) => {
        const basePiece = piece.base;
        const pieceId = +id;

        const { width, height } = getBoundingBox(basePiece);
        const pieceState = pieceStatus[pieceId];

        if (pieceState.isOnBoard) return null;

        return (
          <DraggablePiece id={id} pieceId={pieceId} key={id}>
            <div
              className="relative"
              style={{
                width: width * CELL_SIZE,
                height: height * CELL_SIZE
              }}
            >
              <Piece
                base={basePiece}
                anchor={[0, 0]} // top-left anchor for layout
                color={piece.color}
              />
            </div>
          </DraggablePiece>
        );
      })}
    </div>
  );
}
