
import KDBush from './src/index.js';
import v8 from 'v8';

const randomInt = max => Math.floor(Math.random() * max);
const randomPoint = max => ({x: randomInt(max), y: randomInt(max)});
const heapSize = () => `${v8.getHeapStatistics().used_heap_size / 1000  } KB`;

const points = [];
for (let i = 0; i < 1000000; i++) points.push(randomPoint(1000));

console.log(`memory: ${  heapSize()}`);

console.time(`index ${  points.length  } points`);
const index = new KDBush(points, p => p.x, p => p.y, 64, Uint32Array);
console.timeEnd(`index ${  points.length  } points`);

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
// for (let i = 0; i < 10000; i++) {
//     const p = randomPoint(1000);
//     index.within(p.x, p.y, 1);
// }

for (let i = 0; i < 10000; i++) {

    const rangePt = randomPoint(1000);

    const ids = index.within(rangePt.x, rangePt.y, 1);

    if (ids.length > 0) {

        const pts = ids.map((id) => {
            return index.points[ id ];
        });

        const guard = 707;
    }
}

console.timeEnd('10000 small radius queries');
