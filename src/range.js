
export default function range(ids, coords, minX, minY, minZ, maxX, maxY, maxZ, nodeSize, axisCount) {
    const stack = [0, ids.length - 1, 0];
    const result = [];

    // recursively search for items in range in the kd-sorted arrays
    while (stack.length) {
        const axis = stack.pop();
        const right = stack.pop();
        const left = stack.pop();

        // if we reached "tree node", search linearly
        if (right - left <= nodeSize) {
            for (let i = left; i <= right; i++) {
                const x = coords[axisCount * i + 0];
                const y = coords[axisCount * i + 1];
                const z = coords[axisCount * i + 2];
                if (
                    x >= minX && x <= maxX &&
                    y >= minY && y <= maxY &&
                    z >= minZ && z <= maxZ
                ) result.push(ids[i]);
            }
            continue;
        }

        // otherwise find the middle index
        const m = (left + right) >> 1;

        // include the middle item if it's in range
        const x = coords[axisCount * m + 0];
        const y = coords[axisCount * m + 1];
        const z = coords[axisCount * m + 2];
        if (
            x >= minX && x <= maxX &&
            y >= minY && y <= maxY &&
            z >= minZ && z <= maxZ
    ) result.push(ids[m]);

        // queue search in halves that intersect the query
        let next_axis = (1 + axis) % axisCount;
        let min_conditional;
        let max_conditional;

        switch (axis) {

            case 0:
                min_conditional = minX <= x;
                max_conditional = maxX >= x;
                break;

            case 1:
                min_conditional = minY <= y;
                max_conditional = maxY >= y;
                break;

            case 2:
                min_conditional = minZ <= z;
                max_conditional = maxZ >= z;
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
