## kdbush

A very fast static spatial index for 2D points based on a flat KD-tree.

```js
var ids = new Int32Array(points.length);
var coords = new Int32Array(points.length * 2);

for (var i = 0; i < points.length; i++) {
    ids[i] = i;
    coords[2 * i] = points[i].x;
    coords[2 * i + 1] = points[i].y;
}

// rearrange items in ids and coords for KD-search
kdbush(ids, coords);

// bbox search - minX, minY, maxX, maxY
var resultIds = kdbush.range(ids, coords, 10, 10, 20, 20);

// radius search - x, y, radius
var resultIds2 = kdbush.within(ids, coords, 10, 10, 5);
```

If you need to index rectangles or ability to add and remove items dynamically, check out [RBush](https://github.com/mourner/rbush).
