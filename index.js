
const ARRAY_TYPES = [
    Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array,
    Int32Array, Uint32Array, Float32Array, Float64Array
];

const VERSION = 1; // serialized format version
const HEADER_SIZE = 8;

export default class KDBush {

    static from(data) {
        if (!(data instanceof ArrayBuffer)) {
            throw new Error('Data must be an instance of ArrayBuffer.');
        }
        const [magic, versionAndType] = new Uint8Array(data, 0, 2);
        if (magic !== 0xdb) {
            throw new Error('Data does not appear to be in a KDBush format.');
        }
        if (versionAndType >> 4 !== VERSION) {
            throw new Error(`Got v${versionAndType >> 4} data when expected v${VERSION}.`);
        }
        const [nodeSize] = new Uint16Array(data, 2, 1);
        const [numItems] = new Uint32Array(data, 4, 1);

        return new KDBush(numItems, nodeSize, ARRAY_TYPES[versionAndType & 0x0f], data);
    }

    constructor(numItems, nodeSize = 64, ArrayType = Float64Array, data) {
        if (isNaN(numItems) || numItems <= 0) throw new Error(`Unpexpected numItems value: ${numItems}.`);

        this.numItems = +numItems;
        this.nodeSize = Math.min(Math.max(+nodeSize, 2), 65535);
        this.ArrayType = ArrayType;
        this.IndexArrayType = numItems < 65536 ? Uint16Array : Uint32Array;

        const arrayTypeIndex = ARRAY_TYPES.indexOf(this.ArrayType);
        const coordsByteSize = numItems * 2 * this.ArrayType.BYTES_PER_ELEMENT;
        const idsByteSize = numItems * this.IndexArrayType.BYTES_PER_ELEMENT;
        const padCoords = (8 - idsByteSize % 8) % 8;

        if (arrayTypeIndex < 0) {
            throw new Error(`Unexpected typed array class: ${ArrayType}.`);
        }

        if (data && (data instanceof ArrayBuffer)) { // reconstruct an index from a buffer
            this.data = data;
            this.ids = new this.IndexArrayType(this.data, HEADER_SIZE, numItems);
            this.coords = new this.ArrayType(this.data, HEADER_SIZE + idsByteSize + padCoords, numItems * 2);
            this._pos = numItems * 2;
            this._finished = true;
        } else { // initialize a new index
            this.data = new ArrayBuffer(HEADER_SIZE + coordsByteSize + idsByteSize + padCoords);
            this.ids = new this.IndexArrayType(this.data, HEADER_SIZE, numItems);
            this.coords = new this.ArrayType(this.data, HEADER_SIZE + idsByteSize + padCoords, numItems * 2);
            this._pos = 0;
            this._finished = false;

            // set header
            new Uint8Array(this.data, 0, 2).set([0xdb, (VERSION << 4) + arrayTypeIndex]);
            new Uint16Array(this.data, 2, 1)[0] = nodeSize;
            new Uint32Array(this.data, 4, 1)[0] = numItems;
        }
    }

    add(x, y) {
        const index = this._pos >> 1;
        this.ids[index] = index;
        this.coords[this._pos++] = x;
        this.coords[this._pos++] = y;
        return index;
    }

    finish() {
        const numAdded = this._pos >> 1;
        if (numAdded !== this.numItems) {
            throw new Error(`Added ${numAdded} items when expected ${this.numItems}.`);
        }
        // kd-sort both arrays for efficient search
        sort(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0);

        this._finished = true;
        return this;
    }

    range(minX, minY, maxX, maxY) {
        if (!this._finished) throw new Error('Data not yet indexed - call index.finish().');

        const {ids, coords, nodeSize} = this;
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
                    const x = coords[2 * i];
                    const y = coords[2 * i + 1];
                    if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[i]);
                }
                continue;
            }

            // otherwise find the middle index
            const m = (left + right) >> 1;

            // include the middle item if it's in range
            const x = coords[2 * m];
            const y = coords[2 * m + 1];
            if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[m]);

            // queue search in halves that intersect the query
            if (axis === 0 ? minX <= x : minY <= y) {
                stack.push(left);
                stack.push(m - 1);
                stack.push(1 - axis);
            }
            if (axis === 0 ? maxX >= x : maxY >= y) {
                stack.push(m + 1);
                stack.push(right);
                stack.push(1 - axis);
            }
        }

        return result;
    }

    within(qx, qy, r) {
        if (!this._finished) throw new Error('Data not yet indexed - call index.finish().');

        const {ids, coords, nodeSize} = this;
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
            if (axis === 0 ? qx - r <= x : qy - r <= y) {
                stack.push(left);
                stack.push(m - 1);
                stack.push(1 - axis);
            }
            if (axis === 0 ? qx + r >= x : qy + r >= y) {
                stack.push(m + 1);
                stack.push(right);
                stack.push(1 - axis);
            }
        }

        return result;
    }
}

function sort(ids, coords, nodeSize, left, right, axis) {
    if (right - left <= nodeSize) return;

    const m = (left + right) >> 1; // middle index

    // sort ids and coords around the middle index so that the halves lie
    // either left/right or top/bottom correspondingly (taking turns)
    select(ids, coords, m, left, right, axis);

    // recursively kd-sort first half and second half on the opposite axis
    sort(ids, coords, nodeSize, left, m - 1, 1 - axis);
    sort(ids, coords, nodeSize, m + 1, right, 1 - axis);
}

// custom Floyd-Rivest selection algorithm: sort ids and coords so that
// [left..k-1] items are smaller than k-th item (on either x or y axis)
function select(ids, coords, k, left, right, axis) {

    while (right > left) {
        if (right - left > 600) {
            const n = right - left + 1;
            const m = k - left + 1;
            const z = Math.log(n);
            const s = 0.5 * Math.exp(2 * z / 3);
            const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
            const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            select(ids, coords, k, newLeft, newRight, axis);
        }

        const t = coords[2 * k + axis];
        let i = left;
        let j = right;

        swapItem(ids, coords, left, k);
        if (coords[2 * right + axis] > t) swapItem(ids, coords, left, right);

        while (i < j) {
            swapItem(ids, coords, i, j);
            i++;
            j--;
            while (coords[2 * i + axis] < t) i++;
            while (coords[2 * j + axis] > t) j--;
        }

        if (coords[2 * left + axis] === t) swapItem(ids, coords, left, j);
        else {
            j++;
            swapItem(ids, coords, j, right);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
    }
}

function swapItem(ids, coords, i, j) {
    swap(ids, i, j);
    swap(coords, 2 * i, 2 * j);
    swap(coords, 2 * i + 1, 2 * j + 1);
}

function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function sqDist(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
}
