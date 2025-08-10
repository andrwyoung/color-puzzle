// ui helpers for rotating, flipping base pieces + normalizing to [0, 0]

import type { Coordinate } from "../../types/puzzle-types";

// rotate clockwise
export function rotateClockwise(coords: Coordinate[]): Coordinate[] {
  const rotated = coords.map(([row, col]): Coordinate => [col, -row]);

  return normalizedCoordinates(rotated);
}

// rotate counterclockwise
export function rotateCounterclockwise(coords: Coordinate[]): Coordinate[] {
  const rotated = coords.map(([row, col]): Coordinate => [-col, row]);

  return normalizedCoordinates(rotated);
}

// flip horizontally
export function flipHorizontally(coords: Coordinate[]): Coordinate[] {
  const rotated = coords.map(([row, col]): Coordinate => [row, -col]);

  return normalizedCoordinates(rotated);
}

// flip vertically
export function flipVertically(coords: Coordinate[]): Coordinate[] {
  const rotated = coords.map(([row, col]): Coordinate => [-row, col]);

  return normalizedCoordinates(rotated);
}

// translate so that top left corner is 0, 0
function normalizedCoordinates(coords: Coordinate[]): Coordinate[] {
  const minRow = Math.min(...coords.map(([r]) => r));
  const minCol = Math.min(...coords.map(([, c]) => c));

  return coords.map(([row, col]): Coordinate => [row - minRow, col - minCol]);
}


// DEPRECATED
export function getOrientedCoords(base: Coordinate[], orientation: number): Coordinate[] {
  
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
