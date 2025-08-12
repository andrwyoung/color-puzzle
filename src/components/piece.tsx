// this is what a piece looks like when it's not yet placed on the board

import { CELL_SIZE } from "../lib/constants/ui-constants";
import { type Coordinate } from "../types/puzzle-types";

export function Piece({
  base,
  anchor,
  color,
  isSelected = false,
  isDragging
}: {
  base: Coordinate[];
  anchor: [number, number];
  color: string;
  isSelected?: boolean;
  isDragging: boolean;
}) {
  // fast lookup for border rendering
  const cellSet = new Set(base.map(([r, c]) => `${r},${c}`));
  const hasCell = (r: number, c: number) => cellSet.has(`${r},${c}`);

  const showSelectionUi = isSelected && !isDragging;
  const borderColor = showSelectionUi ? "rgba(255,255,255,0.2)" : "transparent";

  // this mess is here SIMPLY cause I wanted to make the piece bigger on hover lol
  // 1) bounding box in cell units
  const drs = base.map(([dr]) => dr);
  const dcs = base.map(([, dc]) => dc);
  const minDr = Math.min(...drs);
  const maxDr = Math.max(...drs);
  const minDc = Math.min(...dcs);
  const maxDc = Math.max(...dcs);
  // 2) wrapper position in px (align to top-left of piece)
  const groupTop = (anchor[0] + minDr) * CELL_SIZE;
  const groupLeft = (anchor[1] + minDc) * CELL_SIZE;
  const groupWidth = (maxDc - minDc + 1) * CELL_SIZE + 2; // +2 to account for your 1px offset borders
  const groupHeight = (maxDr - minDr + 1) * CELL_SIZE + 2;

  return (
    <div className="relative">
      <div
        className="absolute cursor-pointer origin-center transition-transform
         duration-150 ease-out hover:scale-105 z-0"
        style={{
          top: groupTop - 1,
          left: groupLeft - 1,
          width: groupWidth,
          height: groupHeight
        }}
      >
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
              className="absolute flex items-center justify-center"
              style={{
                top: top - 1,
                left: left - 1,
                width: CELL_SIZE + 2,
                height: CELL_SIZE + 2,
                color: color,
                borderTop,
                borderBottom,
                borderLeft,
                borderRight,
                boxSizing: "border-box"
              }}
            >
              <div className="w-5/8 h-5/8 rotate-45 rounded-lg" style={{ backgroundColor: color }}></div>
              {/* <DiamondShape className={`rotate-45 scale-115`}></DiamondShape> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
