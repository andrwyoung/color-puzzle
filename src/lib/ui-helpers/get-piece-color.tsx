// get what color a piece should be

import { DEFAULT_COLOR, ERROR_COLOR } from "../constants/ui-constants";
import { ALL_PIECES } from "../constants/piece-constants";

export function getPieceColor(id: number): string {
  if (id === 0) return DEFAULT_COLOR;
  return ALL_PIECES[id]?.color ?? ERROR_COLOR;
}
