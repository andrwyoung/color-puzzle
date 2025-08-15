// this is the rectangle that "holds" the pieces when they are not
// yet placed on the board

import { FaArrowsAltH } from "react-icons/fa";
import { FaArrowRotateRight, FaArrowRotateLeft } from "react-icons/fa6";
import { usePieceManipulation } from "../hooks/rotate-and-flip-handlers";
import { ALL_PIECES } from "../lib/constants/piece-constants";
import { CELL_SIZE } from "../lib/constants/ui-constants";
import { getBoundingBox } from "../lib/ui-helpers/get-bounding-box";
import type { PieceStatusMap } from "../types/puzzle-types";
import { DraggablePiece } from "./drag-and-drop/draggable-piece";
import { Piece } from "./piece";

export default function PieceContainer({
  pieceStatus,
  setPieceStatus,
  selectedPieceId,
  onPieceSelect,
  isDragging
}: {
  pieceStatus: PieceStatusMap;
  setPieceStatus: React.Dispatch<React.SetStateAction<PieceStatusMap>>;
  selectedPieceId: number | null;
  onPieceSelect: (pieceId: number) => void;
  isDragging: boolean;
}) {
  const { rotateSelectedClockwise, flipSelectedHorizontally, rotateSelectedCounterclockwise } = usePieceManipulation({
    selectedPieceId,
    pieceStatus,
    setPieceStatus
  });

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {Object.entries(ALL_PIECES).map(([id, piece]) => {
        const pieceId = +id;
        const pieceState = pieceStatus[pieceId];
        const isSelected = (selectedPieceId === pieceId);
        const showSelectionUi = isSelected && !isDragging;

        const currentOrientation = pieceState.orientation;
        const { width, height } = getBoundingBox(currentOrientation);

        if (pieceState.isOnBoard) return null;

        return (
          <div className="relative" key={`piece-${pieceId}`}>
            {showSelectionUi && (
              <div className="absolute z-50 -translate-y-12 flex gap-2">
                {!ALL_PIECES[pieceId].disableRotation && (
                  <button
                    className="
                  p-2 bg-primary rounded-md text-background hover:scale-105
              hover:bg-white cursor-pointer"
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
                    className="
                  p-2 bg-primary rounded-md text-background hover:scale-105
              hover:bg-white cursor-pointer"
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
                    className="
                  p-2 bg-primary rounded-md text-background hover:scale-105
              hover:bg-white cursor-pointer"
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
            <DraggablePiece id={id} pieceId={pieceId} key={id}>
              <div
                className="relative"
                style={{
                  width: width * CELL_SIZE,
                  height: height * CELL_SIZE
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
                />
              </div>
            </DraggablePiece>
          </div>
        );
      })}
    </div>
  );
}
