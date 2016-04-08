'use strict';

var kdbush = require('./');

var points = [];
for (var i = 0; i < 1000000; i++) {
    points.push(randomPoint(1000));
}

console.log(points.length);


console.time('kdbush');

var ids = new Int32Array(points.length);
var coords = new Int32Array(points.length * 2);

for (var i = 0; i < points.length; i++) {
    ids[i] = i;
    coords[2 * i] = points[i].x;
    coords[2 * i + 1] = points[i].y;
}

kdbush(ids, coords);

console.timeEnd('kdbush');


console.time('range');

for (var i = 0; i < 10000; i++) {
    var p = randomPoint(1000);
    kdbush.range(ids, coords, p.x - 1, p.y - 1, p.x + 1, p.y + 1);
}

console.timeEnd('range');


console.time('within');

for (var i = 0; i < 10000; i++) {
    var p = randomPoint(1000);
    kdbush.within(ids, coords, p.x, p.y, 1);
}

console.timeEnd('within');


function randomPoint(max) {
    return {
        x: randomInt(max),
        y: randomInt(max)
    };
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}
