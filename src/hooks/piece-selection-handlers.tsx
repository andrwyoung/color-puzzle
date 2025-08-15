export function useSelectionHandlers({
  selectedPieceId,
  setSelectedPieceId
}: {
  selectedPieceId: number | null;
  setSelectedPieceId: React.Dispatch<React.SetStateAction<number | null>>;
}) {

  function selectPiece(pieceId: number) {
    setSelectedPieceId(pieceId)
  }

  function deselectAll() {
    setSelectedPieceId(null);
  }

  function isSelected(pieceId: number) {
    return selectedPieceId === pieceId;
  }

  // DEPRECATED -- previous implementation

  // function handlePieceSelect(pieceId: number) {
  //   setPieceStatus(prev => {
  //     return Object.fromEntries(
  //       Object.entries(prev).map(([id, state]) => [
  //         +id,
  //         +id === pieceId ? { ...state, isSelected: true } : { ...state, isSelected: false }
  //       ])
  //     );
  //   });
  // }

  // function handleDeselectAll() {
  //   setPieceStatus(prev => {
  //     const newStatus: PieceStatusMap = {};

  //     Object.entries(prev).forEach(([id, state]) => {
  //       const newPieceState: PieceState = {
  //         ...state,
  //         isSelected: false
  //       };
  //       newStatus[+id] = newPieceState;
  //     });

  //     return newStatus;
  //   });
  // }

  return {
    selectPiece,
    deselectAll,
    isSelected
  };
}
