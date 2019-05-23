
import KDBush from './src/index.js';
import { heapSize, randomPoint3d } from './src/utils.js';

const extent = 5e2;
const points = [];
for (let i = 0; i < 1e6; i++) points.push(randomPoint3d(extent));

console.log(`memory: ${  heapSize()}`);

console.time(`index ${  points.length  } points`);

const axisCount = 3;
const config =
    {
        points,
        getX: p => p.x,
        getY: p => p.y,
        getZ: p => p.z,
        nodeSize: 64,
        ArrayType: Float64Array,
        axisCount
    };

const index = new KDBush(config);
console.timeEnd(`index ${ points.length } points`);

console.log(`memory: ${  heapSize()}`);

const queryCount = 1e5;

console.time( queryCount + ' bbox queries');

for (let i = 0; i < queryCount; i++) {

    const rangePt = randomPoint3d(extent);

    const delta = 2;
    const ids = index.range(rangePt.x - delta, rangePt.y - delta, rangePt.z - delta, rangePt.x + delta, rangePt.y + delta, rangePt.z + delta);

    // if (ids.length > 0) {
    //
    //     const pts = ids.map((id) => {
    //         return index.points[ id ];
    //     });
    //
    //     const guard = 707;
    // }
}

console.timeEnd(queryCount + ' bbox queries');

console.time(queryCount + ' radial queries');

for (let i = 0; i < queryCount; i++) {

    const rangePt = randomPoint3d(extent);

    const ids = index.within(rangePt.x, rangePt.y, rangePt.z, 2);

    // if (ids.length > 0) {
    //
    //     const pts = ids.map((id) => {
    //         return index.points[ id ];
    //     });
    //
    //     const guard = 707;
    // }
}

console.timeEnd(queryCount + ' radial queries');
