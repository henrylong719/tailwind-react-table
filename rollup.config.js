import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';

export default [
  {
    input: './packages/src/index.tsx',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        exports: 'named',
      },
    ],

    plugins: [
      postcss({
        config: {
          path: './postcss.config.js',
        },
        extensions: ['.css'],
        minimize: true,
        inject: {
          insertAt: 'top',
        },
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react'],
      }),
      external(),
      resolve(),
      terser(),
      typescript(),
      commonjs({
        namedExports: {
          'react-table': [
            'useTable',
            'useSortBy',
            'useFilters',
            'useGlobalFilter',
            'usePagination',
            'useRowSelect',
            'useExpanded',
            'useRowState',
            'useAsyncDebounce',
          ],
          'react-csv': ['CSVLink'],
          'react-loading-skeleton': ['Skeleton'],
        },
      }),
    ],
    external: ['react', 'react-dom', 'react-csv'],
  },
];
