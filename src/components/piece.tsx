// this is what a piece looks like when it's not yet placed on the board

import { CELL_SIZE } from "../lib/constants/ui-constants";
import { type Coordinate } from "../types/puzzle-types";

export function Piece({ base, anchor, color, isSelected = false }: { base: Coordinate[]; anchor: [number, number]; color: string, isSelected?: boolean }) {
  // fast lookup for border rendering
  const cellSet = new Set(base.map(([r, c]) => `${r},${c}`));
  const hasCell = (r: number, c: number) => cellSet.has(`${r},${c}`);

  const borderColor = isSelected ? "#FACC15" : "transparent";

  return (
    <div className="absolute">
      {base.map(([dr, dc], i) => {
        const top = (anchor[0] + dr) * CELL_SIZE;
        const left = (anchor[1] + dc) * CELL_SIZE;

        const borderTop = !hasCell(dr - 1, dc) ? `2px solid ${borderColor}` : "none";
        const borderBottom = !hasCell(dr + 1, dc) ? `2px solid ${borderColor}` : "none";
        const borderLeft = !hasCell(dr, dc - 1) ? `2px solid ${borderColor}` : "none";
        const borderRight = !hasCell(dr, dc + 1) ? `2px solid ${borderColor}` : "none";

        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: top - 1,
              left: left - 1,
              width: CELL_SIZE + 2,
              height: CELL_SIZE + 2,
              backgroundColor: color,
              borderTop,
              borderBottom,
              borderLeft,
              borderRight,
              boxSizing: "border-box"
            }}
          />
        );
      })}
    </div>
  );
}
