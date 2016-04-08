'use strict';

module.exports = within;

function within(ids, coords, qx, qy, r, nodeSize) {
    var stack = [0, ids.length - 1, 0];
    var result = [];

    var minX = qx - r;
    var minY = qy - r;
    var maxX = qx + r;
    var maxY = qy + r;
    var r2 = r * r;

    nodeSize = nodeSize || 64;

    while (stack.length) {
        var axis = stack.pop();
        var right = stack.pop();
        var left = stack.pop();

        if (right - left <= nodeSize) {
            for (var i = left; i <= right; i++) {
                if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) result.push(ids[i]);
            }

        } else {
            var m = Math.floor((left + right) / 2);

            var x = coords[2 * m];
            var y = coords[2 * m + 1];
            if (sqDist(x, y, qx, qy) <= r2) result.push(ids[m]);

            var nextAxis = (axis + 1) % 2;
            var val = axis === 0 ? x : y;

            if ((axis === 0 ? minX : minY) <= val) {
                stack.push(left);
                stack.push(m);
                stack.push(nextAxis);
            }
            if ((axis === 0 ? maxX : maxY) >= val) {
                stack.push(m);
                stack.push(right);
                stack.push(nextAxis);
            }
        }
    }

    return result;
}

function sqDist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return dx * dx + dy * dy;
}
