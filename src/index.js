
import sort from './sort';
import range from './range';
import within from './within';

export default class KDBush {
    constructor({ points, getX, getY, getZ, nodeSize, ArrayType, axisCount }) {
        this.nodeSize = nodeSize;
        this.points = points;
        this.axisCount = axisCount;

        const IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;

        // store indices to the input array and coordinates in separate typed arrays
        const ids = this.ids = new IndexArrayType(points.length);
        const coords = this.coords = new ArrayType(points.length * axisCount);

        for (let i = 0; i < points.length; i++) {
            ids[i] = i;
            coords[axisCount * i + 0] = getX(points[i]);
            coords[axisCount * i + 1] = getY(points[i]);
            coords[axisCount * i + 2] = getZ(points[i]);
        }

        // kd-sort both arrays for efficient search (see comments in sort.js)
        sort(ids, coords, nodeSize, 0, ids.length - 1, 0, axisCount);

    }

    range(minX, minY, minZ, maxX, maxY, maxZ) {
        return range(this.ids, this.coords, minX, minY, minZ, maxX, maxY, maxZ, this.nodeSize, this.axisCount);
    }

    within(x, y, z, r) {
        return within(this.ids, this.coords, x, y, z, r, this.nodeSize, this.axisCount);
    }
}
