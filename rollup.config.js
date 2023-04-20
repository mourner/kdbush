import terser from '@rollup/plugin-terser';

const config = (file, plugins) => ({
    input: 'index.js',
    output: {
        name: 'KDBush',
        format: 'umd',
        indent: false,
        file
    },
    plugins
});

export default [
    config('kdbush.js', []),
    config('kdbush.min.js', [terser()])
];
