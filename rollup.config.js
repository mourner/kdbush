import {uglify} from 'rollup-plugin-uglify';

const config = (file, plugins) => ({
    input: 'src/kdbush.js',
    output: {
        name: 'kdbush',
        format: 'umd',
        indent: false,
        file
    },
    plugins
});

export default [
    config('kdbush.js', []),
    config('kdbush.min.js', [uglify()])
];
