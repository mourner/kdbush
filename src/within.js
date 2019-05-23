
export default function within(ids, coords, qx, qy, r, nodeSize) {
    const stack = [0, ids.length - 1, 0];
    const result = [];
    const r2 = r * r;

    // recursively search for items within radius in the kd-sorted arrays
    while (stack.length) {
        const axis = stack.pop();
        const right = stack.pop();
        const left = stack.pop();

        // if we reached "tree node", search linearly
        if (right - left <= nodeSize) {
            for (let i = left; i <= right; i++) {
                if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) result.push(ids[i]);
            }
            continue;
        }

        // otherwise find the middle index
        const m = (left + right) >> 1;

        // include the middle item if it's in range
        const x = coords[2 * m];
        const y = coords[2 * m + 1];
        if (sqDist(x, y, qx, qy) <= r2) result.push(ids[m]);

        // queue search in halves that intersect the query
        let next_axis = (1 + axis) % 2;
        let min_conditional;
        let max_conditional;

        switch (axis) {

            case 0:
                min_conditional = qx - r <= x;
                max_conditional = qx + r >= x;
                break;

            case 1:
                min_conditional = qy - r <= y;
                max_conditional = qy + r >= y;
                break;

        }

        if (min_conditional) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(next_axis);
        }

        if (max_conditional) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(next_axis);
        }
    }

    return result;
}

function sqDist(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
}
