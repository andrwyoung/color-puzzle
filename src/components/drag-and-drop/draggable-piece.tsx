// this is the wrapper that makes something able to be dragged around on screen!

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export function DraggablePiece({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none"
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {children}
    </div>
  );
}
