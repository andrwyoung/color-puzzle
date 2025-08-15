import type { Coordinate, PieceStatusMap } from "../types/puzzle-types";
import { rotateClockwise, rotateCounterclockwise, flipHorizontally, flipVertically } from "../lib/ui-helpers/get-oriented-coords";

export function usePieceManipulation({ 
    selectedPieceId,
    pieceStatus, 
    setPieceStatus 
}: { 
    selectedPieceId: number | null;
    pieceStatus: PieceStatusMap;
    setPieceStatus: React.Dispatch<React.SetStateAction<PieceStatusMap>>;
}) {

    function transformSelectedPiece(transformFn: (coords: Coordinate[]) => Coordinate[]) {
        if (selectedPieceId === null) {
            console.log(selectedPieceId, "no transform because null")
            return;
        }

        const pieceId = selectedPieceId;
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