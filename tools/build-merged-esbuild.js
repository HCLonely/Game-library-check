const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const headerTemplate = require('../src/meta/userscript-header.ts');

const outFile = path.resolve(__dirname, '../raw/Game-Library-Check.user.js');
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));

if (typeof packageJson.version !== 'string' || packageJson.version.length === 0) {
  throw new Error('package.json must contain a non-empty version string');
}

const header = headerTemplate.replace('__PACKAGE_VERSION__', () => packageJson.version);

esbuild.build({
  entryPoints: [path.resolve(__dirname, '../src/index.ts')],
  bundle: true,
  platform: 'browser',
  format: 'iife',
  target: ['chrome100'],
  write: false,
  charset: 'utf8',
  banner: { js: header }
}).then(({ outputFiles }) => {
  fs.writeFileSync(outFile, `${outputFiles[0].text}\n`, 'utf8');
  console.log('raw/Game-Library-Check.user.js文件写入成功');
}).catch((error) => {
  console.error('esbuild转换失败: ', error);
  process.exit(1);
});
