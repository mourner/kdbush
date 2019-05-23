
export default function within(ids, coords, qx, qy, qz, r, nodeSize, axisCount) {
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
                if (sqDist(
                    coords[axisCount * i + 0],
                    coords[axisCount * i + 1],
                    coords[axisCount * i + 2],
                    qx,
                    qy,
                    qz
                ) <= r2) {
                    result.push(ids[i]);
                }
            }
            continue;
        }

        // otherwise find the middle index
        const m = (left + right) >> 1;

        // include the middle item if it's in range
        const x = coords[axisCount * m + 0];
        const y = coords[axisCount * m + 1];
        const z = coords[axisCount * m + 2];
        if (sqDist(
            x,
            y,
            z,
            qx,
            qy,
            qz
        ) <= r2) {
            result.push(ids[m]);
        }

        // queue search in halves that intersect the query
        let next_axis = (1 + axis) % axisCount;
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

            case 2:
                min_conditional = qz - r <= z;
                max_conditional = qz + r >= z;
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

function sqDist(ax, ay, az, bx, by, bz) {
    const dx = ax - bx;
    const dy = ay - by;
    const dz = az - bz;
    return dx * dx + dy * dy + dz * dz;
}
