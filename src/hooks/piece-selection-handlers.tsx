import type { PieceState, PieceStatusMap } from "../types/puzzle-types";

export function useSelectionHandlers({
  pieceStatus,
  setPieceStatus
}: {
  pieceStatus: PieceStatusMap;
  setPieceStatus: React.Dispatch<React.SetStateAction<PieceStatusMap>>;
}) {

  function handlePieceSelect(pieceId: number) {
    setPieceStatus(prev => {
      return Object.fromEntries(
        Object.entries(prev).map(([id, state]) => [
          +id,
          +id === pieceId
          ? { ...state, isSelected: true }
          : { ...state, isSelected: false }
        ])
      );
    });
  }

  function handleDeselectAll() {
    setPieceStatus(prev => {
      const newStatus: PieceStatusMap = {};
      
      Object.entries(prev).forEach(([id, state]) => {
        const newPieceState: PieceState = {
          ...state,
          isSelected: false
        };
        newStatus[+id] = newPieceState;
      });
      
      return newStatus;
    });
  }

  return {
    handlePieceSelect,
    handleDeselectAll
  };
}