const fs = require('fs');
const assert = require('assert');
const { describe, it } = require('node:test');

const rawMergedPath = './raw/Game-Library-Check.user.js';
const mergedBuildPath = './Game-Library-Check.user.js';

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

describe('merged userscript contract', () => {
  it('raw merged script exists', () => {
    assert.ok(fs.existsSync(rawMergedPath), 'missing raw/Game-Library-Check.user.js');
  });

  it('contains platform toggle keys', () => {
    const text = readIfExists(rawMergedPath);
    assert.ok(text.includes('platformEnabled'), 'missing platformEnabled settings');
    assert.ok(text.includes('epic'), 'missing epic toggle');
    assert.ok(text.includes('gog'), 'missing gog toggle');
    assert.ok(text.includes('itch'), 'missing itch toggle');
    assert.ok(text.includes('cube'), 'missing cube toggle');
  });

  it('contains platform switch menu command', () => {
    const text = readIfExists(rawMergedPath);
    assert.ok(text.includes('平台开关'), 'missing 平台开关 menu');
  });

  it('build output contains merged userscript header', () => {
    const built = readIfExists(mergedBuildPath);
    assert.ok(built.includes('@name'), 'missing @name in build output');
  });
});
