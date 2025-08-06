// get what color a piece should be

import { DEFAULT_COLOR, ERROR_COLOR } from "../constants/ui";
import { PIECES } from "../constants/pieces";

export function getPieceColor(id: number): string {
  if (id === 0) return DEFAULT_COLOR;
  return PIECES[id]?.color ?? ERROR_COLOR;
}
