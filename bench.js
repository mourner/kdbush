
import KDBush from './src/index.js';
import { heapSize, randomPoint3d } from './src/utils.js';

const points = [];
for (let i = 0; i < 1000000; i++) points.push(randomPoint3d(1000));

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

// console.time('10000 small bbox queries');
//
// for (let i = 0; i < 10000; i++) {
//
//     const rangePt = randomPoint(1000);
//
//     const ids = index.range(rangePt.x - 1, rangePt.y - 1, rangePt.x + 1, rangePt.y + 1);
//
//     if (ids.length > 0) {
//
//         const pts = ids.map((id) => {
//             return index.points[ id ];
//         });
//
//         const guard = 707;
//     }
// }
//
// console.timeEnd('10000 small bbox queries');

console.time('10000 small radius queries');

for (let i = 0; i < 10000; i++) {

    const rangePt = randomPoint3d(1000);

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

console.timeEnd('10000 small radius queries');
