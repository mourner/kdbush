'use strict';

var kdbush = require('./src/kdbush');

var points = [];
for (var i = 0; i < 1000000; i++) {
    points.push(randomPoint(1000));
}

console.time('index ' + points.length + ' points');
var index = kdbush(points,
    (p) => p.x,
    (p) => p.y, 64, Int32Array);
console.timeEnd('index ' + points.length + ' points');

console.time('10000 small bbox queries');
for (var i = 0; i < 10000; i++) {
    var p = randomPoint(1000);
    index.range(p.x - 1, p.y - 1, p.x + 1, p.y + 1);
}
console.timeEnd('10000 small bbox queries');


console.time('10000 small radius queries');
for (var i = 0; i < 10000; i++) {
    var p = randomPoint(1000);
    index.within(p.x, p.y, 1);
}
console.timeEnd('10000 small radius queries');


function randomPoint(max) {
    return {
        x: randomInt(max),
        y: randomInt(max)
    };
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}
