// this is the wrapper that makes a piece able to be dragged around on screen!

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { PuzzleData } from "../../types/puzzle-types";

export function DraggablePiece({ 
  id, 
  pieceId, 
  children,
  cellSize,
  puzzleData
}: { 
  id: string; 
  pieceId: number; 
  children: React.ReactNode ;
  cellSize: number;
  puzzleData: PuzzleData | null;
}) {
  const isFixed = puzzleData?.fixedPieces?.includes(pieceId) ?? false;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled: isFixed,
    data: {
      pieceId,
      cellSize
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none"
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} {...(isFixed ? {} : listeners)} data-id={id} style={style} >
      {children}
    </div>
  );
}
