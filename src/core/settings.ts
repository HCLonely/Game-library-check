import type {
  GlobalSettings,
  PlatformEnabledSettings,
  ShowDialog
} from '../shared/types';

const SETTINGS_KEY = 'globalSettings';

type StoredGlobalSettings = Partial<Omit<GlobalSettings, 'platformEnabled'>> & {
  platformEnabled?: Partial<PlatformEnabledSettings>;
};

interface SettingsControllerOptions {
  showDialog: ShowDialog;
}

function getGlobalSettings(): GlobalSettings {
  const defaults: GlobalSettings = {
    whiteList: GM_getValue<string[]>('whiteList') || [],
    blackList: GM_getValue<string[]>('blackList') || [],
    platformEnabled: { epic: true, gog: true, itch: true, cube: true, ig: true }
  };
  const saved = GM_getValue<StoredGlobalSettings>(SETTINGS_KEY) || {};
  return {
    whiteList: Array.isArray(saved.whiteList) ? saved.whiteList : defaults.whiteList,
    blackList: Array.isArray(saved.blackList) ? saved.blackList : defaults.blackList,
    platformEnabled: { ...defaults.platformEnabled, ...(saved.platformEnabled || {}) }
  };
}

function setGlobalSettings(settings: GlobalSettings): void {
  GM_setValue(SETTINGS_KEY, settings);
}

function isUrlEnabledByList(url: string, settings: GlobalSettings): boolean {
  const { whiteList, blackList } = settings;
  if (whiteList.length > 0) return whiteList.some((item) => url.includes(item));
  if (blackList.length > 0) return !blackList.some((item) => url.includes(item));
  return true;
}

function createSettingsController({ showDialog }: SettingsControllerOptions) {
  const settings = getGlobalSettings();

  function openPlatformSwitchDialog() {
    const current = settings.platformEnabled;
    const bodyNode = document.createElement('div');
    const platformRows: Array<[string, string, boolean]> = [
      ['glc-epic', 'Epic', current.epic],
      ['glc-gog', 'GOG', current.gog],
      ['glc-itch', 'Itch', current.itch],
      // ['glc-cube', 'Cube', current.cube],
      ['glc-ig', 'IG', current.ig]
    ];
    platformRows.forEach(([id, labelText, checked], index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = id;
      input.checked = Boolean(checked);
      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${labelText}`));
      bodyNode.appendChild(label);
      if (index < 4) bodyNode.appendChild(document.createElement('br'));
    });
    showDialog({
      title: '平台开关',
      bodyNode,
      confirmText: '保存',
      cancelText: '取消',
      onConfirm: (root) => {
        settings.platformEnabled = {
          ...current,
          epic: root.querySelector<HTMLInputElement>('#glc-epic')?.checked ?? false,
          gog: root.querySelector<HTMLInputElement>('#glc-gog')?.checked ?? false,
          itch: root.querySelector<HTMLInputElement>('#glc-itch')?.checked ?? false,
          // cube: root.querySelector('#glc-cube').checked,
          ig: root.querySelector<HTMLInputElement>('#glc-ig')?.checked ?? false
        };
        setGlobalSettings(settings);
      }
    });
  }

  function showListEditor(
    title: string,
    initialValue: string[],
    onSave: (value: string[]) => void
  ): void {
    const bodyNode = document.createElement('textarea');
    bodyNode.className = 'glc-textarea';
    bodyNode.value = initialValue.join('\n');
    showDialog({
      title,
      bodyNode,
      confirmText: '保存',
      cancelText: '取消',
      onConfirm: (root) => {
        const value = root.querySelector<HTMLTextAreaElement>('.glc-textarea')?.value || '';
        onSave(value ? value.split('\n') : []);
      }
    });
  }

  function addWhiteList() {
    showListEditor('添加白名单网站', settings.whiteList || [], (value) => {
      settings.whiteList = value;
      settings.blackList = settings.blackList || [];
      setGlobalSettings(settings);
    });
  }

  function addBlackList() {
    showListEditor('添加黑名单网站', settings.blackList || [], (value) => {
      settings.blackList = value;
      settings.whiteList = settings.whiteList || [];
      setGlobalSettings(settings);
    });
  }

  function setting() {
    const bodyNode = document.createElement('div');
    const whiteButton = document.createElement('button');
    const blackButton = document.createElement('button');
    whiteButton.type = 'button';
    whiteButton.id = 'glc-open-whitelist';
    whiteButton.textContent = '白名单网站';
    blackButton.type = 'button';
    blackButton.id = 'glc-open-blacklist';
    blackButton.textContent = '黑名单网站';
    bodyNode.appendChild(whiteButton);
    bodyNode.appendChild(blackButton);
    showDialog({
      title: '设置',
      bodyNode,
      confirmText: '关闭',
      hideCancel: true
    });
    document.getElementById('glc-open-whitelist')?.addEventListener('click', addWhiteList);
    document.getElementById('glc-open-blacklist')?.addEventListener('click', addBlackList);
  }

  return {
    settings,
    setting,
    openPlatformSwitchDialog,
    isUrlEnabled: (url: string) => isUrlEnabledByList(url, settings)
  };
}

module.exports = {
  getGlobalSettings,
  setGlobalSettings,
  isUrlEnabledByList,
  createSettingsController
};
