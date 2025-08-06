// this is what a piece looks like when it's not yet placed on the board

import { CELL_SIZE } from "../lib/constants/ui-constants";
import { type Coordinate } from "../types/puzzle-types";

export function Piece({
  variation,
  anchor,
  color
}: {
  variation: Coordinate[];
  anchor: [number, number];
  color: string;
}) {
  return (
    <div className="absolute">
      {variation.map(([dr, dc], i) => {
        const top = (anchor[0] + dr) * CELL_SIZE;
        const left = (anchor[1] + dc) * CELL_SIZE;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              top,
              left,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: color
            }}
          />
        );
      })}
    </div>
  );
}
