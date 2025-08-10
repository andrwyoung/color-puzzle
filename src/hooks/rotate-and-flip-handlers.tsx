import type { PieceState, PieceStatusMap } from "../types/puzzle-types";
import { rotateClockwise, rotateCounterclockwise, flipHorizontally, flipVertically } from "../lib/ui-helpers/get-oriented-coords";

export function usePieceManipulation({ 
    pieceStatus, 
    setPieceStatus 
}: { 
    pieceStatus: PieceStatusMap;
    setPieceStatus: React.Dispatch<React.SetStateAction<PieceStatusMap>>;
}) {

    const getSelectedPieceId = () => {
        return Object.entries(pieceStatus).find(([ , state]) => state.isSelected)?.[0];
    }

    function rotateSelectedClockwise() {
        const selectedPieceId = getSelectedPieceId();
        if (!selectedPieceId) return;

        const pieceId = +selectedPieceId;
        const currentOrientation = pieceStatus[pieceId].orientation;
        const newOrientation = rotateClockwise(currentOrientation);

        const newPieceState: PieceState = {
            isOnBoard: false,
            isSelected: true,
            orientation: newOrientation,
            position: null
          };

        setPieceStatus(prev => ({
            ... prev,
            [pieceId]: newPieceState
        }));
    }

    function rotateSelectedCounterclockwise() {
        const selectedPieceId = getSelectedPieceId();
        if (!selectedPieceId) return;

        const pieceId = +selectedPieceId;
        const currentOrientation = pieceStatus[pieceId].orientation;
        const newOrientation = rotateCounterclockwise(currentOrientation);

        setPieceStatus(prev => ({
            ... prev,
            [pieceId]: { ...prev[pieceId], orientation: newOrientation }
        }));
    }

    function flipSelectedHorizontally() {
        const selectedPieceId = getSelectedPieceId();
        if (!selectedPieceId) return;

        const pieceId = +selectedPieceId;
        const currentOrientation = pieceStatus[pieceId].orientation;
        const newOrientation = flipHorizontally(currentOrientation);

        setPieceStatus(prev => ({
            ... prev,
            [pieceId]: { ...prev[pieceId], orientation: newOrientation }
        }));
    }

    function flipSelectedVertically() {
        const selectedPieceId = getSelectedPieceId();
        if (!selectedPieceId) return;

        const pieceId = +selectedPieceId;
        const currentOrientation = pieceStatus[pieceId].orientation;
        const newOrientation = flipVertically(currentOrientation);

        setPieceStatus(prev => ({
            ... prev,
            [pieceId]: { ...prev[pieceId], orientation: newOrientation }
        }));
    }

    return {
        rotateSelectedClockwise,
        rotateSelectedCounterclockwise,
        flipSelectedHorizontally,
        flipSelectedVertically
    };
}