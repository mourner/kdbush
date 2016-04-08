'use strict';

var sort = require('./sort');
var range = require('./range');
var within = require('./within');

module.exports = kdbush;

function kdbush(points, getX, getY, nodeSize, arrayType) {
    /* eslint consistent-return: 0, new-cap: 0 */
    if (!(this instanceof kdbush)) return new kdbush(points, getX, getY, nodeSize, arrayType);

    getX = getX || defaultGetX;
    getY = getY || defaultGetY;
    arrayType = arrayType || Array;
    this.nodeSize = nodeSize || 64;

    var ids = this.ids = new arrayType(points.length);
    var coords = this.coords = new arrayType(points.length * 2);

    for (var i = 0; i < points.length; i++) {
        ids[i] = i;
        coords[2 * i] = getX(points[i]);
        coords[2 * i + 1] = getY(points[i]);
    }

    sort(ids, coords, this.nodeSize, 0, ids.length - 1, 0);
}

kdbush.prototype = {
    range: function (minX, minY, maxX, maxY) {
        return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
    },

    within: function (x, y, r) {
        return within(this.ids, this.coords, x, y, r, this.nodeSize);
    }
};

function defaultGetX(p) { return p[0]; }
function defaultGetY(p) { return p[1]; }
