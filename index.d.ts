type Points = number[][]

declare class KDBush<T> {
  ids: number[]
  coords: number[]
  nodeSize: number
  points: T[]
  range(minX: number, minY: number, maxX: number, maxY: number)
  within(x: number, y: number, r: number)
}

interface KDBush<T> {
  (points: Points): KDBush<Points>
  <T>(points: T[], getX: (p: T) => void, getY: (p: T) => void, nodeSize?: number, ArrayType?: any): KDBush<T>
}

declare const kdbush: KDBush<Points>
declare namespace kdbush {}
export = kdbush
