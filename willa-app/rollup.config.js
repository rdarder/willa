import nodeResolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import terser from '@rollup/plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import { copy } from '@web/rollup-plugin-copy';

export default {
  input: 'build/willa-app.js',
  output: {
    format: 'es',
    dir: 'dist',
  },
  preserveEntrySignatures: false,

  plugins: [
    /** Resolve bare module imports */
    nodeResolve({ extensions: ['.js'] }),
    /** Minify JS, compile JS to a lower language target */
    terser({
      module: true,
      warnings: true,
    }),
    esbuild({
      minify: true,
      target: ['chrome64', 'firefox67', 'safari11.1'],
    }),
    analyze(),
    copy({
      patterns: ['**/*'],
      rootDir: 'assets',
    }),
  ],
};
