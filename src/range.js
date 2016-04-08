'use strict';

module.exports = range;

function range(ids, coords, minX, minY, maxX, maxY, nodeSize) {
    var stack = [0, ids.length - 1, 0];
    var result = [];
    var x, y;

    nodeSize = nodeSize || 64;

    while (stack.length) {
        var axis = stack.pop();
        var right = stack.pop();
        var left = stack.pop();

        if (right - left <= nodeSize) {
            for (var i = left; i <= right; i++) {
                x = coords[2 * i];
                y = coords[2 * i + 1];
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[i]);
            }

        } else {
            var m = Math.floor((left + right) / 2);

            x = coords[2 * m];
            y = coords[2 * m + 1];
            if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[m]);

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
