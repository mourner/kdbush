import v8 from "v8";

export const randomInt = max => Math.floor(Math.random() * max);
export const randomPoint = max => ({x: randomInt(max), y: randomInt(max)});
export const randomPoint3d = max => ({x: randomInt(max), y: randomInt(max), z: randomInt(max)});
export const heapSize = () => `${v8.getHeapStatistics().used_heap_size / 1000  } KB`;
