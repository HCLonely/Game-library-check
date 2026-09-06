const { setSyncValue } = require('./sync-data.ts') as typeof import('./sync-data');
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
  /** 打开设置对话框。 */
  showDialog: ShowDialog;
}

/**
 * 从存储中加载全局设置，并与旧版列表值和平台默认值合并。
 *
 * @returns 规范化的全局设置。
 */
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

/**
 * 将完整的全局设置对象持久化到用户脚本存储中。
 *
 * @param settings - 要保存的设置。
 */
function setGlobalSettings(settings: GlobalSettings): void {
  setSyncValue(SETTINGS_KEY, settings);
}

/**
 * 确定 URL 是否被配置的白名单或黑名单允许。
 *
 * 非空白名单具有优先级；两份列表均未填充时，允许所有 URL。
 *
 * @param url - 要评估的 URL。
 * @param settings - 包含 URL 列表的设置。
 * @returns 该 URL 是否已启用。
 */
function isUrlEnabledByList(url: string, settings: GlobalSettings): boolean {
  const { whiteList, blackList } = settings;
  if (whiteList.length > 0) return whiteList.some((item) => url.includes(item));
  if (blackList.length > 0) return !blackList.some((item) => url.includes(item));
  return true;
}

/**
 * 创建由共享的持久化设置对象支持的设置操作。
 *
 * @param options - 对话框 UI 依赖项。
 * @returns 设置，以及用于打开设置和平台切换对话框的方法。
 */
function createSettingsController({ showDialog }: SettingsControllerOptions) {
  const settings = getGlobalSettings();

  /** 打开对话框，将已启用的平台选择保存到全局设置中。 */
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

  /**
   * 打开以换行符分隔的列表编辑器，并将保存的条目传递给调用方。
   *
   * @param title - 对话框标题。
   * @param initialValue - 要预填的条目。
   * @param onSave - 接收保存后的条目。
   */
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

  /** 打开白名单编辑器并持久化保存后的白名单。 */
  function addWhiteList() {
    showListEditor('添加白名单网站', settings.whiteList || [], (value) => {
      settings.whiteList = value;
      settings.blackList = settings.blackList || [];
      setGlobalSettings(settings);
    });
  }

  /** 打开黑名单编辑器并持久化保存后的黑名单。 */
  function addBlackList() {
    showListEditor('添加黑名单网站', settings.blackList || [], (value) => {
      settings.blackList = value;
      settings.whiteList = settings.whiteList || [];
      setGlobalSettings(settings);
    });
  }

  /** 打开顶层设置对话框，其中包含通往白名单和黑名单编辑器的链接。 */
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
    /** 使用此控制器的当前设置确定 URL 是否已启用。 */
    isUrlEnabled: (url: string) => isUrlEnabledByList(url, settings)
  };
}

module.exports = {
  getGlobalSettings,
  setGlobalSettings,
  isUrlEnabledByList,
  createSettingsController
};
