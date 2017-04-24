import * as kdbush from './'

// API
const points = [[110, 60], [130, 40]]
const index = kdbush(points)

// range
index.range(10, 10, 20, 20)
index.range(10, 10, 20, 20).map(id => points[id])

// within
index.within(10, 10, 5)
index.within(10, 10, 5).map(id => points[id])

// custom points
const xy = [{x: 110, y: 60}, {x: 130, y: 40}]
const latlng = [[60, 110], [40, 130]]
kdbush(xy, p => p.x, p => p.y)
kdbush(latlng, p => p[1], p => p[0])
kdbush(latlng, p => p[1], p => p[0], 64, Int32Array)
