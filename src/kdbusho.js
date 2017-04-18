'use strict';

var sort = require('./sort');
var range = require('./range');
var within = require('./within');

module.exports = kdbushO;

function kdbushO(points, getX, getY, nodeSize, ArrayType) {
    return new KDBushO(points, getX, getY, nodeSize, ArrayType);
}

function KDBushO(points, getX, getY, nodeSize, ArrayType) {
    getX = getX || defaultGetX;
    getY = getY || defaultGetY;
    ArrayType = ArrayType || Array;

    this.nodeSize = nodeSize || 64;
    var keys = Object.keys(points);

    this.ids = new ArrayType(keys.length);
    this.coords = new ArrayType(keys.length * 2);

    for (var i = 0; i < keys.length; i++) {
        this.ids[i] = i;
        var key = keys[i];
        this.coords[2 * i] = getX(points[key]);
        this.coords[2 * i + 1] = getY(points[key]);
    }

    sort(this.ids, this.coords, this.nodeSize, 0, this.ids.length - 1, 0);
}

KDBushO.prototype = {
    range: function (minX, minY, maxX, maxY) {
        return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
    },

    within: function (x, y, r) {
        return within(this.ids, this.coords, x, y, r, this.nodeSize);
    }
};

function defaultGetX(p) { return p[0]; }
function defaultGetY(p) { return p[1]; }
