const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { describe, it, before } = require('node:test');

const rawMergedPath = path.resolve(__dirname, '../../raw/Game-Library-Check.user.js');
const mergedBuildPath = path.resolve(__dirname, '../../Game-Library-Check.user.js');
const mergedAllBuildPath = path.resolve(__dirname, '../../Game-Library-Check.all.user.js');

function readRequiredFile(filePath, missingMessage) {
  assert.ok(fs.existsSync(filePath), `${missingMessage} (path: ${filePath})`);
  return fs.readFileSync(filePath, 'utf8');
}

function extractPlatformEnabledBlock(text) {
  const match = text.match(/platformEnabled\s*:\s*\{([\s\S]*?)\}/);
  assert.ok(match, 'missing platformEnabled object in userscript settings');
  return match[1];
}

describe('merged userscript contract', () => {
  let rawMergedText = '';
  let builtMergedText = '';
  let builtMergedAllText = '';

  it('raw merged script exists', () => {
    assert.ok(
      fs.existsSync(rawMergedPath),
      `missing raw/Game-Library-Check.user.js (path: ${rawMergedPath})`,
    );
  });

  describe('raw merged userscript content', () => {
    before(() => {
      rawMergedText = readRequiredFile(
        rawMergedPath,
        'missing raw/Game-Library-Check.user.js',
      );
    });

    it('contains platform toggle keys in platformEnabled settings object', () => {
      const platformEnabledBlock = extractPlatformEnabledBlock(rawMergedText);
      assert.match(platformEnabledBlock, /\bepic\s*:/, 'missing epic key in platformEnabled settings');
      assert.match(platformEnabledBlock, /\bgog\s*:/, 'missing gog key in platformEnabled settings');
      assert.match(platformEnabledBlock, /\bitch\s*:/, 'missing itch key in platformEnabled settings');
      assert.match(platformEnabledBlock, /\bcube\s*:/, 'missing cube key in platformEnabled settings');
    });

    it('contains platform switch menu command', () => {
      assert.ok(rawMergedText.includes('平台开关'), 'missing 平台开关 menu');
    });

    it('does not include deprecated UI/polyfill dependencies in merged raw metadata', () => {
      assert.doesNotMatch(rawMergedText, /@require\s+.*jquery/i, 'should remove jquery requires');
      assert.doesNotMatch(rawMergedText, /@require\s+.*sweetalert2/i, 'should remove sweetalert2 require');
      assert.doesNotMatch(rawMergedText, /@require\s+.*overhang/i, 'should remove overhang require');
      assert.doesNotMatch(rawMergedText, /@require\s+.*promise-polyfill/i, 'should remove promise-polyfill require');
      assert.doesNotMatch(rawMergedText, /@resource\s+overhang/i, 'should remove overhang resource');
    });

    it('contains aggregated startup orchestration markers', () => {
      assert.match(rawMergedText, /collectEmptyCaches\s*\(/, 'missing collectEmptyCaches orchestrator');
      assert.match(rawMergedText, /showEmptyCacheAggregationDialog\s*\(/, 'missing aggregated empty-cache dialog');
      assert.match(rawMergedText, /batchUpdateSelectedModules\s*\(/, 'missing batch update orchestrator');
      assert.match(rawMergedText, /runInitialFlow\s*\(/, 'missing startup flow orchestrator');
    });
  });

  describe('merged build output content', () => {
    before(() => {
      builtMergedText = readRequiredFile(
        mergedBuildPath,
        'missing built Game-Library-Check.user.js',
      );
      builtMergedAllText = readRequiredFile(
        mergedAllBuildPath,
        'missing built Game-Library-Check.all.user.js',
      );
    });

    it('contains merged userscript header', () => {
      assert.ok(builtMergedText.includes('@name'), 'missing @name in build output');
    });

    it('has valid JavaScript syntax after bundling resources', () => {
      assert.doesNotThrow(
        () => new Function(builtMergedAllText),
        'merged all-in-one build output should parse as JavaScript',
      );
    });
  });
});
