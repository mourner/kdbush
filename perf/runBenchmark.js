// A simple script to compare performance of KDBush to flatbush
const KDBush = require('../kdbush');
const Flatbush = require('flatbush');

const Benchmark = require('benchmark');

// use deterministic randomness, to guarantee reproducible results.
const random = require('ngraph.random')(42);

const totalPoints = 100000;
const distributionRadius = 1000; // range of the uniform distribution
const uniformlyDistributedPoints = [];

for (let i = 0; i < totalPoints; ++i) {
    uniformlyDistributedPoints.push([
        (random.nextDouble() - 0.5) * distributionRadius,
        (random.nextDouble() - 0.5) * distributionRadius,
    ]);
}

// Going to store nearest neighbors counts, so that V8 doesn't deoptimize unused variables.
let lengths;
const suite = new Benchmark.Suite();

suite
    .add('kdbush', () => {
        const index = new KDBush(uniformlyDistributedPoints);
        lengths = [];
        for (let i = 0; i < 10; ++i) {
            lengths.push(index.within(i, i, 10).length);
        }
    })
    .add('flatbush', () => {
        const index = new Flatbush(uniformlyDistributedPoints.length);
        for (let i = 0; i < uniformlyDistributedPoints.length; ++i) {
            const p = uniformlyDistributedPoints[i];
            index.add(p[0], p[1], p[0], p[1]);
        }
        index.finish();

        lengths = [];
        for (let i = 0; i < 10; ++i) {
            lengths.push(index.neighbors(i, i, Infinity, 10).length);
        }
    })
    .on('cycle', (event) => {
    // given that input array is always the same, we should expect that all methods
    // return the same number of neighbors. Note, this is a bit fragile, since change
    // in the seed/number of input points would result in different numbers here.
        if (!arrayEquals(lengths, [46, 47, 50, 48, 44, 39, 34, 34, 28, 31]))
            throw new Error('Something is wrong. Unexpected lengths');
        console.log(String(event.target));
    })
    .on('complete', function () {
        // eslint-disable-next-line no-invalid-this
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: true});

function arrayEquals(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}
