const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const testFile = path.resolve(__dirname, '../tests/merged-userscript/merged-script.test.js');

if (!fs.existsSync(testFile)) {
  console.log('Skipping merged userscript test: tests/merged-userscript/merged-script.test.js is absent');
  process.exit(0);
}

const result = spawnSync(process.execPath, ['--test', testFile], { stdio: 'inherit' });

if (result.error) {
  console.error('Failed to run merged userscript test:', result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
