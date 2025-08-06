// has the highlighted array changed at all?

export function areMasksEqual(a: boolean[][], b: boolean[][]): boolean {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i].length; j++) {
      if (a[i][j] !== b[i][j]) return false;
    }
  }
  return true;
}
