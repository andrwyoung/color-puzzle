import type { Coordinate, OrientationType } from "../../types/puzzle-types";

export function getOrientedCoords(base: Coordinate[], orientation: OrientationType): Coordinate[] {
  // STEP 1: transform each cell
  let transformed = base.map(([y, x]) => {
    // if flipped
    if (orientation.flip) x = -x;

    // if rotated, rotate clockwise
    // 90°: (y, x) -> (x, -y)
    switch (orientation.rotation) {
      case 0:
        return [y, x] as Coordinate;
      case 1:
        return [x, -y] as Coordinate;
      case 2:
        return [-y, -x] as Coordinate;
      case 3:
        return [-x, y] as Coordinate;
      default:
        return [y, x] as Coordinate;
    }
  });

  // STEP 2: normalize so top-left sits at (0,0)
  let minY = Infinity,
    minX = Infinity;
  for (const [y, x] of transformed) {
    if (y < minY) minY = y;
    if (x < minX) minX = x;
  }

  transformed = transformed.map(([y, x]) => [y - minY, x - minX] as Coordinate);

  // STEP 3: (not really neccesary) stable sort for deterministic order
  transformed.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  return transformed;
}
