// Type definitions for [KDBush] [3.0.0]

/*~ Since this is a UMD module that exposes a global variable 'KDBush' when
 *~ loaded outside a module loader environment, we declare that global here.
 */
export as namespace KDBush

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
export = KDBush

declare class KDBush {
  constructor(
    points: [number, number][],
    getX?: (p: any) => number,
    getY?: (p: any) => number,
    nodeSize?: number,
    ArrayType?: Float64ArrayConstructor,
  )

  range(minX: number, minY: number, maxX: number, maxY: number): number[]
  within(x: number, y: number, radius: number): number[]
}
