// this is the wrapper that makes a piece able to be dragged around on screen!

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Coordinate } from "../../types/puzzle-types";

export function DraggablePiece({
  id,
  variation,
  color,
  children
}: {
  id: string;
  variation: Coordinate[];
  color: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      pieceId: +id,
      variation,
      color
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
