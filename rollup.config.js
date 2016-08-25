const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
module.exports = {
  entry: './public/src/js/index.js',
  dest: './public/dist/js/index.js',
  format: 'umd',
  globals: {
    stampit: 'stampit'
  },
  plugins: [node(), commonjs()]
};