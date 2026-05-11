const assert = require('assert');
const { describe, it } = require('node:test');

const { createStartupFlow } = require('../src/core/startup');
const { BASE_STYLE } = require('../src/shared/constants');

describe('startup flow ui behavior', () => {
  it('places toast container at top center', () => {
    assert.match(
      BASE_STYLE,
      /#glc-toast-container\{[^}]*top:18px[^}]*left:50%[^}]*transform:translateX\(-50%\)/,
      'toast container should be top-centered with 18px offset',
    );
    assert.doesNotMatch(
      BASE_STYLE,
      /#glc-toast-container\{[^}]*bottom:18px/,
      'toast container should not remain bottom-aligned',
    );
  });

  it('shows dialog with platform and reason when platform update fails', async () => {
    const dialogCalls = [];
    const toastCalls = [];

    const startupFlow = createStartupFlow({
      showDialog: (config) => {
        dialogCalls.push(config);
      },
      showProgressPanel: () => {},
      clearProgressPanel: () => {},
      showToast: (...args) => {
        toastCalls.push(args);
      },
      showLoginExpiredDialog: () => {},
      updateStatus: {
        AUTH_EXPIRED: 'auth_expired',
      },
    });

    const modules = [
      {
        key: 'epic',
        enabled: () => true,
        updateLibrary: async () => ({
          message: '网络超时',
        }),
      },
    ];

    await startupFlow.batchUpdateSelectedModules(modules, ['epic']);

    assert.equal(toastCalls.length, 0, 'failed update should not use error toast');
    assert.equal(dialogCalls.length, 1, 'failed update should open one dialog');
    assert.match(dialogCalls[0].bodyText || '', /EPIC 更新失败：网络超时/, 'dialog should include platform name and reason');
  });

  it('uses dialog instead of toast for showUpdateResult error path', async () => {
    const dialogCalls = [];
    const toastCalls = [];

    const startupFlow = createStartupFlow({
      showDialog: (config) => {
        dialogCalls.push(config);
      },
      showProgressPanel: () => {},
      clearProgressPanel: () => {},
      showToast: (...args) => {
        toastCalls.push(args);
      },
      showLoginExpiredDialog: () => {},
      updateStatus: {
        AUTH_EXPIRED: 'auth_expired',
      },
    });

    await startupFlow.showUpdateResult('Epic已拥有游戏数据更新失败', 'error');

    assert.equal(toastCalls.length, 0, 'showUpdateResult error should not use toast');
    assert.equal(dialogCalls.length, 1, 'showUpdateResult error should open one dialog');
    assert.equal(dialogCalls[0].title, '平台更新失败');
    assert.equal(dialogCalls[0].bodyText, 'Epic已拥有游戏数据更新失败');
  });
});
