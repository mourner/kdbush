type Points = number[][]
type Get<T> = (p: T) => void

declare class KDBush<T> {
  ids: number[]
  coords: number[]
  nodeSize: number
  points: T[]
  range(minX: number, minY: number, maxX: number, maxY: number)
  within(x: number, y: number, r: number)
}

interface KDBushStatic {
  (points: Points): KDBush<Points>
  <T>(points: T[], getX: Get<T>, getY: Get<T>, nodeSize?: number, ArrayType?: any): KDBush<T>
}

declare const kdbush: KDBushStatic
declare namespace kdbush {}
export = kdbush
