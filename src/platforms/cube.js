function createCubeModule(context) {
  const {
    settings,
    queryLinks,
    addClass,
    getHref,
    showUpdateStep,
    showUpdateResult,
    showLoginExpiredDialog,
    UPDATE_STATUS
  } = context;

  let updateLibrary;
  let started = false;
  const moduleApi = {
    key: 'cube',
    enabled: () => settings.platformEnabled.cube,
    isCacheEmpty: () => (GM_getValue('cubeGames') || []).length === 0,
    updateLibrary: () => {
      if (!updateLibrary) moduleApi.start();
      return updateLibrary();
    },
    start: () => {
      if (started) return;
      started = true;
      let loadTimes = 0;

      checkCubeGame();

      const observer = new MutationObserver(() => { checkCubeGame(false, true); });
      observer.observe(document.documentElement, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true
      });

      function checkCubeGame(first = true, again = false) {
        loadTimes++;
        if (loadTimes > 1000) {
          observer.disconnect();
          return;
        }
        const cubeGames = getCubeGameLibrary();
        const excludedClass = again ? 'cube-game-checked' : 'cube-game-link-owned';
        const cubeLink = queryLinks('a[href*="store.cubejoy.com/html/en/store/goodsdetail/detail"]')
          .filter((el) => !el.classList.contains(excludedClass));
        if (cubeLink.length === 0) return;
        if (first) updateCubeGameLibrary(false);
        cubeLink.forEach((el) => {
          addClass(el, 'cube-game-checked');
          let href = getHref(el);
          if (!/\/$/.test(href)) href += '/';
          const cubeGameId = href.match(/https?:\/\/store\.cubejoy\.com\/html\/en\/store\/goodsdetail\/detail([\d]+).html/i)?.[1];
          if (cubeGameId && cubeGames.includes(parseInt(cubeGameId, 10))) {
            addClass(el, 'cube-game-link-owned');
          }
        });
      }
      function getCubeGameLibrary() {
        return GM_getValue('cubeGames') || [];
      }
      function updateCubeGameLibrary(loop = true, i = 1, games = []) {
        if (!loop && i !== 1) {
          GM_setValue('cubeGames', [...new Set([...getCubeGameLibrary(), ...games])]);
          checkCubeGame(false);
          return;
        }
        return new Promise((resolve, reject) => {
          if (loop) {
            showUpdateStep('cube', `第 ${i} 页`);
          }
          GM_xmlhttpRequest({
            method: 'POST',
            url: `https://account.cubejoy.com/Comment/MyGameReq?pageIndex=${i}&pageSize=24`,
            timeout: 15000,
            nocache: true,
            responseType: 'json',
            headers: {
              Accept: 'application/json, text/plain, */*',
              Host: 'account.cubejoy.com',
              Origin: 'https://account.cubejoy.com',
              Referer: 'https://account.cubejoy.com/Comment/MyGame'
            },
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status === 200 ? resolve(response) : reject(response);
            }
          });
        }).then(async (response) => {
          if (response.response?.resultCode === 0) {
            return {
              status: UPDATE_STATUS.AUTH_EXPIRED,
              platformName: '方块',
              loginUrl: 'https://account.cubejoy.com/html/login.html'
            };
          } else if (response.response?.result?.list?.length) {
            games = [...games, ...response.response.result.list.map((e) => e.S_Id)];

            if (response.response?.result.total > i * 24) {
              return await updateCubeGameLibrary(loop, ++i, games);
            } else if (loop) {
              GM_setValue('cubeGames', [...new Set(games)].filter((e) => e));
              await showUpdateResult('cube游戏库数据更新完成', 'success');
              return true;
            }
            GM_setValue('cubeGames', [...new Set([...getCubeGameLibrary(), ...games])].filter((e) => e));
            checkCubeGame(false);
            return true;
          } else if (response.response?.result?.list?.length !== 0) {
            console.error(response);
            await showUpdateResult('方块游戏库数据更新失败', 'error');
            return false;
          }
          return false;
        })
          .catch(async (error) => {
            console.error(error);
            await showUpdateResult('方块游戏库数据更新失败', 'error');
            return false;
          });
      }

      updateLibrary = updateCubeGameLibrary;

      GM_addStyle('.cube-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
    }
  };
  return moduleApi;
}

module.exports = {
  createCubeModule
};
