
import KDBush from './index.js';
import v8 from 'v8';

const randomInt = max => Math.floor(Math.random() * max);
const randomPoint = max => ({x: randomInt(max), y: randomInt(max)});
const heapSize = () => `${v8.getHeapStatistics().used_heap_size / 1000  } KB`;

const N = 1000000;

const coords = new Uint32Array(N * 2);
for (let i = 0; i < N * 2; i++) coords[i] = randomInt(1000);

console.log(`memory: ${heapSize()}`);

console.time(`index ${N} points`);
const index = new KDBush(N, 64, Uint32Array);
for (let i = 0; i < coords.length; i += 2) index.add(coords[i], coords[i + 1]);
index.finish();
console.timeEnd(`index ${N} points`);
console.log(`index size: ${index.data.byteLength.toLocaleString()}`);

console.log(`memory: ${heapSize()}`);

console.time('10000 small bbox queries');
for (let i = 0; i < 10000; i++) {
    const p = randomPoint(1000);
    index.range(p.x - 1, p.y - 1, p.x + 1, p.y + 1);
}
console.timeEnd('10000 small bbox queries');

console.time('10000 small radius queries');
for (let i = 0; i < 10000; i++) {
    const p = randomPoint(1000);
    index.within(p.x, p.y, 1);
}
console.timeEnd('10000 small radius queries');
