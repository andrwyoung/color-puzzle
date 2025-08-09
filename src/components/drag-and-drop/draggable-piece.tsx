// this is the wrapper that makes a piece able to be dragged around on screen!

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export function DraggablePiece({ id, pieceId, children }: { id: string; pieceId: number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      pieceId
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none"
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} data-id={id} style={style}>
      {children}
    </div>
  );
}
