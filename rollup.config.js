import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';

export default {
  input: './src/index.js',
  external: ['fs', 'path'],
  plugins: [
    resolve(),
    commonJS({
      include: 'node_modules/**',
    }),
    babel({
      babelrc: false,
      presets: [
        [
          'es2015',
          {
            modules: false,
          },
        ],
      ],
    }),
  ],
};
