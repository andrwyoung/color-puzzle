// this is the rectangle that "holds" the pieces when they are not
// yet placed on the board

import { ALL_PIECES } from "../lib/constants/piece-constants";
import { CELL_SIZE } from "../lib/constants/ui-constants";
import { getBoundingBox } from "../lib/ui-helpers/get-bounding-box";
import { DraggablePiece } from "./drag-and-drop/draggable-piece";
import { Piece } from "./piece";
import type { PieceStatusMap } from "../types/puzzle-types";

export default function PieceContainer({
  pieceStatus
}: {
  pieceStatus: PieceStatusMap;
}) {
  return (
    <div className="flex flex-wrap gap-4 bg-gray-100 p-4">
      {Object.entries(ALL_PIECES)
      .filter(([id]) => !pieceStatus[+id].isOnBoard) // hide pieces which are on the board
      .map(([id, piece]) => {
        const variation = piece.base; // pick first variation for now
        const { width, height } = getBoundingBox(variation);

        return (
          <DraggablePiece id={id} variation={variation} color={piece.color} key={id}>
            <div
              className="relative"
              style={{
                width: width * CELL_SIZE,
                height: height * CELL_SIZE
              }}
            >
              <Piece
                variation={variation}
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
