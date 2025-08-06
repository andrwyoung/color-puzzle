// this is the rectangle that "holds" the pieces when they are not
// yet placed on the board

import { PIECES } from "../lib/constants/pieces";
import { CELL_SIZE } from "../lib/constants/ui";
import { getBoundingBox } from "../lib/ui-helpers/get-bounding-box";
import { Piece } from "./piece";

export default function PieceContainer() {
  return (
    <div className="flex flex-wrap gap-4 bg-gray-100 p-4">
      {Object.entries(PIECES).map(([id, piece]) => {
        const variation = piece.variations[0]; // pick first variation for now
        const { width, height } = getBoundingBox(variation);

        return (
          <div
            key={id}
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
        );
      })}
    </div>
  );
}
