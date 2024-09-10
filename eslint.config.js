import config from 'eslint-config-mourner';

export default [
    ...config,
    {
        ignores: ['kdbush.js', 'kdbush.min.js']
    }
];
