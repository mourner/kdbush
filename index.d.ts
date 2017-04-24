declare class KDBush {
  range(minX: number, minY: number, maxX: number, maxY: number)
  within(x: number, y: number, r: number)
}

interface KDBush {
  (points: number[][]): KDBush
  <T>(points: T[], getX: (p: T) => void, getY: (p: T) => void, nodeSize?: number, ArrayType?: any): KDBush
}

declare const kdbush: KDBush
declare namespace kdbush {}
export = kdbush
