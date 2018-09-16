
import sort from './sort';
import range from './range';
import within from './within';

const defaultGetX = p => p[0];
const defaultGetY = p => p[1];

export default class KDBush {
    constructor(points, getX = defaultGetX, getY = defaultGetY, nodeSize = 64, ArrayType = Float64Array) {
        this.nodeSize = nodeSize;
        this.points = points;

        this.ArrayType = ArrayType;
        const IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;
        this.IndexArrayType = IndexArrayType;

        // store indices to the input array and coordinates in separate typed arrays
        const ids = this.ids = new IndexArrayType(points.length);
        const coords = this.coords = new ArrayType(points.length * 2);

        for (let i = 0; i < points.length; i++) {
            ids[i] = i;
            coords[2 * i] = getX(points[i]);
            coords[2 * i + 1] = getY(points[i]);
        }

        // kd-sort both arrays for efficient search (see comments in sort.js)
        sort(ids, coords, nodeSize, 0, ids.length - 1, 0);
    }

    range(minX, minY, maxX, maxY) {
        return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
    }

    within(x, y, r) {
        return within(this.ids, this.coords, x, y, r, this.nodeSize);
    }

    export() {
        return {
            nodeSize: this.nodeSize,
            idsData: this.ids.buffer,
            idsType: this.IndexArrayType,
            coordsData: this.coords.buffer || this.coords,
            coordsType: this.ArrayType
        };
    }

    static from(exported) {
        const {nodeSize, idsData, coordsData} = exported;
        const IdsType = exported.idsType;
        const CoordsType = exported.coordsType;

        const instance = new KDBush([], () => {}, () => {}, nodeSize);
        instance.ids = new IdsType(idsData);
        instance.coords = new CoordsType(coordsData);
        return instance;
    }
}
