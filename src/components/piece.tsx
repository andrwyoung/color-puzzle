// this is what a piece looks like when it's not yet placed on the board

import { type Coordinate } from "../types/puzzle-types";

export function Piece({
  base,
  anchor,
  color,
  isSelected = false,
  isDragging,
  cellSize
}: {
  base: Coordinate[];
  anchor: [number, number];
  color: string;
  isSelected?: boolean;
  isDragging: boolean;
  cellSize: number;
}) {
  // fast lookup for border rendering
  const cellSet = new Set(base.map(([r, c]) => `${r},${c}`));
  const hasCell = (r: number, c: number) => cellSet.has(`${r},${c}`);

  const borderColor = (isSelected && !isDragging) ? "rgba(255,255,255,0.2)" : "transparent";

  const cellOffset = Math.max(1, Math.floor(cellSize * 0.015));
  const totalCellSize = cellSize + (cellOffset * 2);

  // this mess is here SIMPLY cause I wanted to make the piece bigger on hover lol
  // 1) bounding box in cell units
  const drs = base.map(([dr]) => dr);
  const dcs = base.map(([, dc]) => dc);
  const minDr = Math.min(...drs);
  const maxDr = Math.max(...drs);
  const minDc = Math.min(...dcs);
  const maxDc = Math.max(...dcs);
  // 2) wrapper position in px (align to top-left of piece)
  const groupTop = (anchor[0] + minDr) * cellSize;
  const groupLeft = (anchor[1] + minDc) * cellSize;
  const groupWidth = (maxDc - minDc + 1) * cellSize + 2; // +2 to account for your 1px offset borders
  const groupHeight = (maxDr - minDr + 1) * cellSize + 2;

  return (
    <div className="relative">
      <div
        className="absolute cursor-pointer origin-center transition-transform
         duration-150 ease-out hover:scale-105 z-0"
        style={{
          top: groupTop - cellOffset,
          left: groupLeft - cellOffset,
          width: groupWidth,
          height: groupHeight
        }}
      >
        {base.map(([dr, dc], i) => {
          const top = (anchor[0] + dr) * cellSize;
          const left = (anchor[1] + dc) * cellSize;

          const borderTop = !hasCell(dr - 1, dc) ? `2px solid ${borderColor}` : "none";
          const borderBottom = !hasCell(dr + 1, dc) ? `2px solid ${borderColor}` : "none";
          const borderLeft = !hasCell(dr, dc - 1) ? `2px solid ${borderColor}` : "none";
          const borderRight = !hasCell(dr, dc + 1) ? `2px solid ${borderColor}` : "none";

          return (
            <div
              key={i}
              className="absolute flex items-center justify-center"
              style={{
                top: top - cellOffset,
                left: left - cellOffset,
                width: totalCellSize,
                height: totalCellSize,
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
