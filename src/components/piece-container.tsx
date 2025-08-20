// this is the rectangle that "holds" the pieces when they are not
// yet placed on the board

import { FaArrowsAltH } from "react-icons/fa";
import { FaArrowRotateRight, FaArrowRotateLeft } from "react-icons/fa6";
import { useDroppable } from "@dnd-kit/core";
import { usePieceManipulation } from "../hooks/rotate-and-flip-handlers";
import { ALL_PIECES } from "../lib/constants/piece-constants";
import { getBoundingBox } from "../lib/ui-helpers/get-bounding-box";
import type { PieceStatusMap } from "../types/puzzle-types";
import { DraggablePiece } from "./drag-and-drop/draggable-piece";
import { Piece } from "./piece";
import { useEffect } from "react";

export default function PieceContainer({
  pieceStatus,
  setPieceStatus,
  selectedPieceId,
  deselectAll,
  onPieceSelect,
  isDragging,
  cellSize
}: {
  pieceStatus: PieceStatusMap;
  setPieceStatus: React.Dispatch<React.SetStateAction<PieceStatusMap>>;
  selectedPieceId: number | null;
  deselectAll: () => void;
  onPieceSelect: (pieceId: number) => void;
  isDragging: boolean;
  cellSize: number;
}) {
  const { setNodeRef } = useDroppable({
    id: "piece-container",
    data: { type: "container" }
  });

  const { rotateSelectedClockwise, flipSelectedHorizontally, rotateSelectedCounterclockwise } = usePieceManipulation({
    selectedPieceId,
    pieceStatus,
    setPieceStatus
  });

  // keyboard shortcuts
  // TODO: shortcuts don't work if the piece is on the board...
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      if (key === "ArrowLeft") {
        e.preventDefault();
        rotateSelectedCounterclockwise();
      } else if (key === "ArrowRight") {
        e.preventDefault();
        rotateSelectedClockwise();
      } else if (key === "ArrowDown" || key === "f" || key === "F") {
        e.preventDefault();
        flipSelectedHorizontally();
      } else if (key === "Escape") {
        e.preventDefault();
        deselectAll();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [flipSelectedHorizontally, rotateSelectedClockwise, rotateSelectedCounterclockwise, deselectAll]);

  return (
    <div ref={setNodeRef} className="flex flex-wrap gap-1 sm:gap-2 md:gap-4 p-1 sm:p-2 md:p-4 max-w-full justify-center">
      {Object.entries(ALL_PIECES).map(([id, piece]) => {
        const pieceId = +id;
        const pieceState = pieceStatus[pieceId];
        const isSelected = selectedPieceId === pieceId;

        const currentOrientation = pieceState.orientation;
        const { width, height } = getBoundingBox(currentOrientation);

        if (pieceState.isOnBoard) return null;

        return (
          <div className="relative" key={`piece-${pieceId}`}>
            {isSelected && !isDragging && (
              <div className="absolute z-50 -translate-y-8 sm:-translate-y-10 flex gap-1 sm:gap-2">
                {!ALL_PIECES[pieceId].disableRotation && (
                  <button
                    aria-label="Rotate piece counterclockwise (←)"
                    title="Rotate piece counterclockwise (←)"
                    type="button"
                    className="p-1 sm:p-2 bg-primary rounded-md text-background hover:scale-105 hover:bg-white cursor-pointer text-xs sm:text-sm"
                    onMouseDown={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      rotateSelectedCounterclockwise();
                    }}
                  >
                    <FaArrowRotateLeft />
                  </button>
                )}
                {!ALL_PIECES[pieceId].disableFlip && (
                  <button
                    type="button"
                    aria-label="Flip piece horizontally (↓ or F)"
                    title="Flip piece horizontally (↓ or F)"
                    className="p-1 sm:p-2 bg-primary rounded-md text-background hover:scale-105 hover:bg-white cursor-pointer text-xs sm:text-sm"
                    onMouseDown={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      flipSelectedHorizontally();
                    }}
                  >
                    <FaArrowsAltH />
                  </button>
                )}
                {!ALL_PIECES[pieceId].disableRotation && (
                  <button
                    type="button"
                    aria-label="Rotate piece clockwise (→)"
                    title="Rotate piece clockwise (→)"
                    className="p-1 sm:p-2 bg-primary rounded-md text-background hover:scale-105 hover:bg-white cursor-pointer text-xs sm:text-sm"
                    onMouseDown={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      rotateSelectedClockwise();
                    }}
                  >
                    <FaArrowRotateRight />
                  </button>
                )}
              </div>
            )}
            <DraggablePiece id={id} pieceId={pieceId} key={id} cellSize={cellSize}>
              <div
                className="relative"
                style={{
                  width: width * cellSize,
                  height: height * cellSize
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                  onPieceSelect(pieceId);
                }}
              >
                <Piece
                  base={currentOrientation}
                  anchor={[0, 0]} // top-left anchor for layout
                  color={piece.color}
                  isSelected={isSelected}
                  isDragging={isDragging}
                  cellSize={cellSize}
                />
              </div>
            </DraggablePiece>
          </div>
        );
      })}
    </div>
  );
}
