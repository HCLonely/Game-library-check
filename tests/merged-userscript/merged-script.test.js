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

    it('contains platform switch entrypoint', () => {
      assert.match(rawMergedText, /openPlatformSwitchDialog\s*\(/, 'missing platform switch dialog entrypoint');
      assert.match(rawMergedText, /GM_registerMenuCommand\([^)]*openPlatformSwitchDialog/, 'missing menu binding for platform switch');
    });

    it('uses unified update menu command and removes per-platform update menu commands', () => {
      assert.match(rawMergedText, /GM_registerMenuCommand\([^)]*["']更新游戏库["']/, 'missing unified update menu command');
      assert.doesNotMatch(rawMergedText, /GM_registerMenuCommand\([^)]*["']更新Epic已拥有游戏数据["']/, 'deprecated epic update menu command should be removed');
      assert.doesNotMatch(rawMergedText, /GM_registerMenuCommand\([^)]*["']更新gog游戏库["']/, 'deprecated gog update menu command should be removed');
      assert.doesNotMatch(rawMergedText, /GM_registerMenuCommand\([^)]*["']更新itch游戏库["']/, 'deprecated itch update menu command should be removed');
      assert.doesNotMatch(rawMergedText, /GM_registerMenuCommand\([^)]*["']更新cube游戏库["']/, 'deprecated cube update menu command should be removed');
      assert.doesNotMatch(rawMergedText, /GM_registerMenuCommand\([^)]*["']更新IG游戏库["']/, 'deprecated ig update menu command should be removed');
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
      assert.match(rawMergedText, /showEmptyCacheAggregationDialog\([\s\S]*?\(\)\s*=>\s*\{[\s\S]*enabledModules\.forEach\(\(\w+\)\s*=>\s*\w+\.start\(\)\)/, 'runInitialFlow should start modules when aggregated dialog is canceled');
      assert.match(rawMergedText, /if\s*\(updateResult\s*===\s*true\)/, 'batch update should only mark success for explicit true result');
      assert.match(rawMergedText, /state\[key\]\s*=\s*[\"\']error[\"\']/, 'batch update should set error state for failed updates');
    });

    it('keeps multi-platform progress state and stacks toasts in a container', () => {
      assert.match(rawMergedText, /let\s+progressPanelStateMap\s*=\s*\{\}/, 'missing shared progress state map');
      assert.match(rawMergedText, /showProgressPanel\(stateMap,\s*\{\s*replace\s*=\s*false\s*\}\s*=\s*\{\}\)/, 'showProgressPanel should support merge updates');
      assert.match(rawMergedText, /progressPanelStateMap\s*=\s*\{\s*\.\.\.progressPanelStateMap,\s*\.\.\.\(?stateMap\s*\|\|\s*\{\}\)?\s*\}/, 'progress updates should merge instead of replacing');
      assert.match(rawMergedText, /function\s+createToastContainer\s*\(/, 'missing toast container helper');
      assert.match(rawMergedText, /container\.id\s*=\s*[\"\']glc-toast-container[\"\']/, 'toast container should use fixed id');
      assert.match(rawMergedText, /#glc-toast-container\{/, 'missing toast container css for stacking');
    });

    it('contains dialog interaction contracts in merged output', () => {
      assert.match(rawMergedText, /addEventListener\(\s*[\"\']keydown[\"\']/, 'dialog should register keydown listener');
      assert.match(rawMergedText, /event\.key\s*===\s*[\"\']Escape[\"\']/, 'dialog should handle Escape key');
      assert.match(rawMergedText, /removeEventListener\(\s*[\"\']keydown[\"\']/, 'dialog should remove keydown listener on close');
      assert.match(rawMergedText, /event\.target\s*!==\s*\w+\s*\)\s*return\s*;/, 'dialog should guard close behavior to mask-only click target');
    });

    it('contains ui polish style token markers in raw merged output', () => {
      assert.match(rawMergedText, /rgba\(15,23,42,(?:0)?\.52\)/, 'missing upgraded dialog mask color token');
      assert.match(rawMergedText, /\.glc-dialog\s*\{[\s\S]*?border-radius\s*:\s*16px\s*;/, 'missing upgraded glc-dialog border radius token');
      assert.match(rawMergedText, /\.glc-dialog\s*\{[\s\S]*?box-shadow\s*:\s*0 24px 64px rgba\(15,23,42,\.22\),0 8px 24px rgba\(15,23,42,\.12\)\s*;/, 'missing upgraded glc-dialog layered shadow token');
      assert.match(rawMergedText, /\.glc-dialog-actions\s+button\s*\{[\s\S]*?border-radius\s*:\s*10px\s*;/, 'missing upgraded dialog action button border radius token');
      assert.match(rawMergedText, /\.glc-dialog-actions\s+\[data-glc-confirm\]\s*\{[\s\S]*?background\s*:\s*linear-gradient\(135deg,#2563eb 0%,#1d4ed8 100%\)\s*;/, 'missing brand gradient confirm button token');
      assert.match(rawMergedText, /\.glc-toast\s*\{[\s\S]*?border-radius\s*:\s*12px\s*;/, 'missing upgraded toast border radius token');
      assert.match(rawMergedText, /@keyframes\s+glc-toast-fade-in\{from\{opacity:0;transform:translateY\(6px\)\}to\{opacity:1;transform:translateY\(0\)\}\}/, 'missing upgraded toast fade-in movement token');
      assert.match(rawMergedText, /\.glc-progress-list\s+li\s*\{[\s\S]*?border-radius\s*:\s*10px\s*;/, 'missing upgraded progress row card token');
      assert.match(rawMergedText, /\.glc-dialog-actions\s+button:focus-visible\s*\{[\s\S]*?outline\s*:\s*2px solid #93c5fd\s*;/, 'missing focus-visible rule for dialog action buttons');
    });

    it('contains toast animation and lifecycle markers', () => {
      assert.match(rawMergedText, /@keyframes\s+glc-toast-fade-in/, 'missing toast fade-in keyframes');
      assert.match(rawMergedText, /@keyframes\s+glc-toast-fade-out/, 'missing toast fade-out keyframes');
      assert.match(rawMergedText, /glc-toast-enter/, 'toast should include enter lifecycle marker');
      assert.match(rawMergedText, /glc-toast-leave/, 'toast should include leave lifecycle marker');
      assert.match(rawMergedText, /setTimeout\(\(\)\s*=>[\s\S]*?remove\(/, 'toast should schedule removal as part of lifecycle');
    });

    it('contains ig platform key in platformEnabled settings', () => {
      const platformEnabledBlock = extractPlatformEnabledBlock(rawMergedText);
      assert.match(platformEnabledBlock, /\big\s*:/, 'missing ig key in platformEnabled settings');
    });

    it('contains ig startup orchestration markers', () => {
      assert.match(rawMergedText, /createIgModule\s*\(/, 'missing createIgModule factory');
      assert.match(rawMergedText, /key\s*:\s*[\"\']ig[\"\']/, 'missing ig module key');
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

    it('wires bootstrap through modular controllers and platform factories', () => {
      const bootstrapPath = path.resolve(__dirname, '../../src/runtime/bootstrap.js');
      const bootstrapText = readRequiredFile(bootstrapPath, 'missing src/runtime/bootstrap.js');

      assert.match(bootstrapText, /createSettingsController\s*\(/, 'bootstrap should compose settings controller');
      assert.match(bootstrapText, /createStartupFlow\s*\(/, 'bootstrap should compose startup flow');
      assert.match(bootstrapText, /createProgressController\s*\(/, 'bootstrap should compose progress controller');
      assert.match(bootstrapText, /createEpicModule\s*\(/, 'bootstrap should compose epic module');
      assert.match(bootstrapText, /createGogModule\s*\(/, 'bootstrap should compose gog module');
      assert.match(bootstrapText, /createItchModule\s*\(/, 'bootstrap should compose itch module');
      assert.match(bootstrapText, /createCubeModule\s*\(/, 'bootstrap should compose cube module');
      assert.match(bootstrapText, /createIgModule\s*\(/, 'bootstrap should compose ig module');
    });

    it('exports non-placeholder module APIs', () => {
      const sourceContracts = [
        ['../../src/core/settings.js', /module\.exports\s*=\s*\{[\s\S]*createSettingsController[\s\S]*\}/],
        ['../../src/core/startup.js', /module\.exports\s*=\s*\{[\s\S]*createStartupFlow[\s\S]*\}/],
        ['../../src/ui/dialog.js', /module\.exports\s*=\s*\{[\s\S]*showDialog[\s\S]*\}/],
        ['../../src/ui/toast.js', /module\.exports\s*=\s*\{[\s\S]*showToast[\s\S]*\}/],
        ['../../src/ui/progress.js', /module\.exports\s*=\s*\{[\s\S]*createProgressController[\s\S]*\}/],
        ['../../src/platforms/epic.js', /module\.exports\s*=\s*\{[\s\S]*createEpicModule[\s\S]*\}/],
        ['../../src/platforms/gog.js', /module\.exports\s*=\s*\{[\s\S]*createGogModule[\s\S]*\}/],
        ['../../src/platforms/itch.js', /module\.exports\s*=\s*\{[\s\S]*createItchModule[\s\S]*\}/],
        ['../../src/platforms/cube.js', /module\.exports\s*=\s*\{[\s\S]*createCubeModule[\s\S]*\}/],
        ['../../src/platforms/ig.js', /module\.exports\s*=\s*\{[\s\S]*createIgModule[\s\S]*\}/],
      ];

      sourceContracts.forEach(([relativePath, matcher]) => {
        const absolute = path.resolve(__dirname, relativePath);
        const source = readRequiredFile(absolute, `missing ${relativePath}`);
        assert.match(source, matcher, `module export contract failed: ${relativePath}`);
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
