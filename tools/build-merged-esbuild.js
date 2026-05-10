const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const header = require('../src/meta/userscript-header');

const outFile = path.resolve(__dirname, '../raw/Game-Library-Check.user.js');

esbuild.build({
  entryPoints: [path.resolve(__dirname, '../src/index.js')],
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
