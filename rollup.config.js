import {terser} from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';

const config = (file, plugins) => ({
    input: 'src/index.js',
    output: {
        name: 'KDBush',
        format: 'umd',
        indent: false,
        file
    },
    plugins
});

export default [
    config('kdbush.js', [buble()]),
    config('kdbush.min.js', [terser(), buble()])
];
