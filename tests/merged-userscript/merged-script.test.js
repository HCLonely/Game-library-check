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

    it('wires cancel path to continue module startup and treats non-true update results as failure', () => {
      assert.match(rawMergedText, /function\s+showEmptyCacheAggregationDialog\s*\([^)]*onCancel[^)]*\)/, 'showEmptyCacheAggregationDialog should accept onCancel callback');
      assert.match(rawMergedText, /onCancel:\s*\(\)\s*=>\s*\{[\s\S]*onCancel\(\)/, 'showEmptyCacheAggregationDialog should forward onCancel into showDialog');
      assert.match(rawMergedText, /showEmptyCacheAggregationDialog\([\s\S]*?\(\)\s*=>\s*\{[\s\S]*enabledModules\.forEach\(\(module\)\s*=>\s*module\.start\(\)\)/, 'runInitialFlow should start modules when aggregated dialog is canceled');
      assert.match(rawMergedText, /if\s*\(updateResult\s*===\s*true\)/, 'batch update should only mark success for explicit true result');
      assert.match(rawMergedText, /state\[key\]\s*=\s*'error'/, 'batch update should set error state for failed updates');
    });

    it('keeps multi-platform progress state and stacks toasts in a container', () => {
      assert.match(rawMergedText, /let\s+progressPanelStateMap\s*=\s*\{\}/, 'missing shared progress state map');
      assert.match(rawMergedText, /showProgressPanel\(stateMap,\s*\{\s*replace\s*=\s*false\s*\}\s*=\s*\{\}\)/, 'showProgressPanel should support merge updates');
      assert.match(rawMergedText, /progressPanelStateMap\s*=\s*\{\s*\.\.\.progressPanelStateMap,\s*\.\.\.\(stateMap\s*\|\|\s*\{\}\)\s*\}/, 'progress updates should merge instead of replacing');
      assert.match(rawMergedText, /function\s+createToastContainer\s*\(/, 'missing toast container helper');
      assert.match(rawMergedText, /container\.id\s*=\s*'glc-toast-container'/, 'toast container should use fixed id');
      assert.match(rawMergedText, /#glc-toast-container\{/, 'missing toast container css for stacking');
    });

    it('contains ig platform key in platformEnabled settings', () => {
      const platformEnabledBlock = extractPlatformEnabledBlock(rawMergedText);
      assert.match(platformEnabledBlock, /\big\s*:/, 'missing ig key in platformEnabled settings');
    });

    it('contains ig startup orchestration markers', () => {
      assert.match(rawMergedText, /createIgModule\s*\(/, 'missing createIgModule factory');
      assert.match(rawMergedText, /key\s*:\s*\'ig\'/, 'missing ig module key');
      assert.match(rawMergedText, /platformEnabled\s*:\s*\{[\s\S]*ig\s*:/, 'missing ig toggle in defaults');
    });

    it('contains modular merged source files', () => {
      const requiredFiles = [
        '../../src/index.js',
        '../../src/meta/userscript-header.js',
        '../../src/core/settings.js',
        '../../src/core/startup.js',
        '../../src/ui/dialog.js',
        '../../src/ui/toast.js',
        '../../src/ui/progress.js',
        '../../src/platforms/epic.js',
        '../../src/platforms/gog.js',
        '../../src/platforms/itch.js',
        '../../src/platforms/cube.js',
        '../../src/platforms/ig.js',
        '../../tools/build-merged-esbuild.js',
      ];

      requiredFiles.forEach((relativePath) => {
        const absolute = path.resolve(__dirname, relativePath);
        assert.ok(fs.existsSync(absolute), `missing modular file: ${relativePath}`);
      });
    });

    it('runs merged build through esbuild raw generation first', () => {
      const packageJsonPath = path.resolve(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      assert.match(packageJson.scripts.merged, /tools\/build-merged-esbuild\.js/, 'missing esbuild raw build step');
      assert.match(packageJson.scripts.merged, /tools\/merged\.js/, 'missing merged post-build step');
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
