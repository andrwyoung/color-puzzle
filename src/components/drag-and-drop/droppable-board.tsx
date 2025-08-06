import { useDroppable } from "@dnd-kit/core";
import React from "react";

type DroppableBoardProps = {
  id: string;
  children: React.ReactNode;
};

export function DroppableBoard({ id, children }: DroppableBoardProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div ref={setNodeRef} data-id={id} className={`${isOver ? "bg-emerald-400" : "bg-emerald-300"} rounded-lg p-2`}>
      {children}
    </div>
  );
}
