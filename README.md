## KDBush

A very fast static spatial index for 2D points based on a flat KD-tree.
Compared to [RBush](https://github.com/mourner/rbush):

- **Points only** — no rectangles.
- **Static** — you can't add/remove items after initial indexing.
- **Faster** indexing and search, with lower **memory** footprint.
- Index is stored as a single **array buffer** (so you can [transfer](https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects) it between threads or store it as a compact file).


If you need a static index for rectangles, not only points, see [Flatbush](https://github.com/mourner/flatbush). When indexing points, KDBush has the advantage of taking ~2x less memory than Flatbush.

[![Build Status](https://github.com/mourner/kdbush/workflows/Node/badge.svg?branch=master)](https://github.com/mourner/kdbush/actions)
[![Simply Awesome](https://img.shields.io/badge/simply-awesome-brightgreen.svg)](https://github.com/mourner/projects)

## Usage

```js
// initialize KDBush for 1000 items
const index = new KDBush(1000);

// fill it with 1000 points
for (const {x, y} of items) {
    index.add(x, y);
}

// perform the indexing
index.finish();

// make a bounding box query
const foundIds = index.range(minX, minY, maxX, maxY);

// map ids to original items
const foundItems = foundIds.map(i => items[i]);

// make a radius query
const neighborIds = index.within(x, y, 5);

// instantly transfer the index from a worker to the main thread
postMessage(index.data, [index.data]);

// reconstruct the index from a raw array buffer
const index = KDBush.from(e.data);
```

## Install

Install with NPM: `npm install kdbush`, then import as a module:

```js
import KDBush from 'kdbush';
```

Or use as a module directly in the browser with [jsDelivr](https://www.jsdelivr.com/esm):

```html
<script type="module">
    import KDBush from 'https://cdn.jsdelivr.net/npm/kdbush/+esm';
</script>
```

Alternatively, there's a browser bundle with a `KDBush` global variable:

```html
<script src="https://cdn.jsdelivr.net/npm/kdbush"></script>
```

## API

#### new KDBush(numItems[, nodeSize, ArrayType])

Creates an index that will hold a given number of points (`numItems`). Additionally accepts:

- `nodeSize`: Size of the KD-tree node, `64` by default. Higher means faster indexing but slower search, and vise versa.
- `ArrayType`: Array type to use for storing coordinate values. `Float64Array` by default, but if your coordinates are integer values, `Int32Array` makes the index faster and smaller.

#### index.add(x, y)

Adds a given point to the index. Returns a zero-based, incremental number that represents the newly added point.

#### index.range(minX, minY, maxX, maxY)

Finds all items within the given bounding box and returns an array of indices that refer to the order the items were added (the values returned by `index.add(x, y)`).

#### index.within(x, y, radius)

Finds all items within a given radius from the query point and returns an array of indices.

#### `KDBush.from(data)`

Recreates a KDBush index from raw `ArrayBuffer` data
(that's exposed as `index.data` on a previously indexed KDBush instance).
Very useful for transferring or sharing indices between threads or storing them in a file.

### Properties

- `data`: array buffer that holds the index.
- `numItems`: number of stored items.
- `nodeSize`: number of items in a KD-tree node.
- `ArrayType`: array type used for internal coordinates storage.
- `IndexArrayType`: array type used for internal item indices storage.
