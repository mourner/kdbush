
export default function sortKD(ids, coords, nodeSize, left, right, axis, axisCount) {
    if (right - left <= nodeSize) return;

    const m = (left + right) >> 1; // middle index

    // sort ids and coords around the middle index so that the halves lie
    // either left/right or top/bottom correspondingly (taking turns)
    select(ids, coords, m, left, right, axis, axisCount);

    // recursively kd-sort first half and second half on the opposite axis
    sortKD(ids, coords, nodeSize, left, m - 1, (1 + axis) % axisCount, axisCount);
    sortKD(ids, coords, nodeSize, m + 1, right, (1 + axis) % axisCount, axisCount);
}

// custom Floyd-Rivest selection algorithm: sort ids and coords so that
// [left..k-1] items are smaller than k-th item (on either x or y axis)
function select(ids, coords, k, left, right, axis, axisCount) {

    while (right > left) {
        if (right - left > 600) {
            const n = right - left + 1;
            const m = k - left + 1;
            const z = Math.log(n);
            const s = 0.5 * Math.exp(2 * z / 3);
            const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
            const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            select(ids, coords, k, newLeft, newRight, axis, axisCount);
        }

        const t = coords[axisCount * k + axis];
        let i = left;
        let j = right;

        swapItem(ids, coords, left, k, axisCount);
        if (coords[axisCount * right + axis] > t) swapItem(ids, coords, left, right, axisCount);

        while (i < j) {
            swapItem(ids, coords, i, j, axisCount);
            i++;
            j--;
            while (coords[axisCount * i + axis] < t) i++;
            while (coords[axisCount * j + axis] > t) j--;
        }

        if (coords[axisCount * left + axis] === t) swapItem(ids, coords, left, j, axisCount);
        else {
            j++;
            swapItem(ids, coords, j, right, axisCount);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
    }
}

function swapItem(ids, coords, i, j, axisCount) {
    swap(ids, i, j);
    swap(coords, axisCount * i + 0, axisCount * j + 0);
    swap(coords, axisCount * i + 1, axisCount * j + 1);
    swap(coords, axisCount * i + 2, axisCount * j + 2);
}

function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}
