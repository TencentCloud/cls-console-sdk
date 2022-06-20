import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import jsx from 'acorn-jsx';

const IS_DEV_ENVIRONMENT = process.env.NODE_ENV === 'development';

export default {
  input: 'src/index.ts',
  acornInjectPlugins: [jsx()],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      inlineSources: IS_DEV_ENVIRONMENT,
      declaration: true,
    }),
    babel({
      presets: ['@babel/preset-react'],
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
    }),
  ],
  output: {
    file: 'dist/bundle.esm.js',
    format: 'esm',
    plugins: [
      getBabelOutputPlugin({
        presets: ['@babel/preset-env'],
      }),
    ],
  },
  external: ['react', 'react-dom'],
};
