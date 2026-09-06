// Match the browser bundle's CommonJS transpilation when running source tests.
const fs = require('node:fs');
const { transformSync } = require('esbuild');
require.extensions['.ts'] = (module, filename) => {
  const { code } = transformSync(fs.readFileSync(filename, 'utf8'), { loader: 'ts', format: 'cjs', target: 'node22', sourcefile: filename });
  module._compile(code, filename);
};
