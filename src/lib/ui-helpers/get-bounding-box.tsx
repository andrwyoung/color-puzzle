// what is the bounding box that wraps each piece look like?

import type { Coordinate } from "../../types/puzzle-types";

export function getBoundingBox(variation: Coordinate[]) {
  const rows = variation.map(([r]) => r);
  const cols = variation.map(([, c]) => c);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);
  return {
    width: maxCol - minCol + 1,
    height: maxRow - minRow + 1
  };
}
