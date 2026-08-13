export type BinaryGrid = number[][];

export function rotateGrid90(grid: BinaryGrid): BinaryGrid {
  const size = grid.length;
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => grid[size - 1 - x][y]),
  );
}

export function circularTranslateGrid(grid: BinaryGrid, dx: number, dy: number): BinaryGrid {
  const size = grid.length;
  const result = Array.from({ length: size }, () => Array<number>(size).fill(0));

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nextX = (x + dx + size) % size;
      const nextY = (y + dy + size) % size;
      result[nextY][nextX] = grid[y][x];
    }
  }

  return result;
}

export function activeCellCount(grid: BinaryGrid): number {
  return grid.flat().reduce((sum, cell) => sum + (cell === 1 ? 1 : 0), 0);
}

export function gridsEqual(left: BinaryGrid, right: BinaryGrid): boolean {
  return left.length === right.length
    && left.every((row, y) => row.length === right[y]?.length
      && row.every((cell, x) => cell === right[y][x]));
}
