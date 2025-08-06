// get what color a piece should be

import { DEFAULT_COLOR, ERROR_COLOR } from "../constants/ui";
import { PIECES } from "../constants/pieces";

export function getPieceColor(id: number | null): string {
  if (id === null) return DEFAULT_COLOR;
  return PIECES[id]?.color ?? ERROR_COLOR;
}
