import type { Coordinate, PieceStatusMap } from "../types/puzzle-types";
import { rotateClockwise, rotateCounterclockwise, flipHorizontally, flipVertically } from "../lib/ui-helpers/get-oriented-coords";

export function usePieceManipulation({ 
    pieceStatus, 
    setPieceStatus 
}: { 
    pieceStatus: PieceStatusMap;
    setPieceStatus: React.Dispatch<React.SetStateAction<PieceStatusMap>>;
}) {

    const getSelectedPieceId = () => {
        return Object.entries(pieceStatus).find(([, state]) => state.isSelected)?.[0];
    }

    function transformSelectedPiece(transformFn: (coords: Coordinate[]) => Coordinate[]) {
        const selectedPieceId = getSelectedPieceId();
        if (!selectedPieceId) return;

        const pieceId = +selectedPieceId;
        const currentOrientation = pieceStatus[pieceId].orientation;
        const newOrientation = transformFn(currentOrientation);

        setPieceStatus(prev => ({
            ...prev,
            [pieceId]: { ...prev[pieceId], orientation: newOrientation }
        }));
    }

    return {
        rotateSelectedClockwise: () => transformSelectedPiece(rotateClockwise),
        rotateSelectedCounterclockwise: () => transformSelectedPiece(rotateCounterclockwise),
        flipSelectedHorizontally: () => transformSelectedPiece(flipHorizontally),
        flipSelectedVertically: () => transformSelectedPiece(flipVertically)
    };
}