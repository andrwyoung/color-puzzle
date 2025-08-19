// this is the wrapper that makes the board able to be dropped in to

import { useDroppable } from "@dnd-kit/core";
import React from "react";

type DroppableBoardProps = {
  id: string;
  children: React.ReactNode;
  cellSize: number;
};

export function DroppableBoard({ id, children, cellSize }: DroppableBoardProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "board",
      cellSize
    }
  });

  return (
    <div
      ref={setNodeRef}
      data-id={id}
      className={`${isOver ? "bg-transparent" : "bg-transparent"} rounded-lg ring-2 ring-white pointer-events-auto`}
    >
      {children}
    </div>
  );
}
