import type { Awaitable, ShowToast, UpdateResult } from '../shared/types';

const ITCH_LINKAGE_CODE_KEY = 'itchLinkageCode';

interface MousePosition {
  x: number;
  y: number;
}

interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number;
}

interface ItchLinkageOptions {
  /** 读取当前缓存的 itch.io 游戏标识符。 */
  getGames: () => string[];
  /** 将游戏标识符添加到 itch.io 已拥有游戏缓存中。 */
  addGames: (games: string[]) => unknown;
  /** 根据请求的页面序列更新 itch.io 已拥有游戏缓存。 */
  updateLibrary: (loop: boolean, page: number) => Awaitable<UpdateResult>;
  /** 在生成或使用联动数据时显示反馈。 */
  showToast: ShowToast;
}

/**
 * 计算 SHA-256 摘要；若 Web Crypto 不可用或失败，则回退到内置实现。
 *
 * @param value - 要进行哈希的 UTF-8 文本。
 * @returns 小写十六进制摘要的 promise。
 */
function sha256(value: string): Promise<string> {
  /** @returns 当 Web Crypto 不可用或拒绝时，返回内置的 SHA-256 摘要。 */
  const fallback = () => sha256Fallback(value);
  if (!globalThis.crypto?.subtle || typeof TextEncoder === 'undefined') {
    return Promise.resolve(fallback());
  }
  return globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
    .then((buffer) => Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join(''))
    .catch(fallback);
}

/**
 * 在不使用 Web Crypto 的情况下计算 SHA-256 摘要，并将输入编码为 UTF-8。
 *
 * @param value - 要进行哈希的文本。
 * @returns 小写十六进制摘要。
 */
function sha256Fallback(value: string): string {
  const bytes = unescape(encodeURIComponent(value)).split('')
    .map((char) => char.charCodeAt(0));
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);
  for (let index = 7; index >= 0; index--) bytes.push((bitLength / (2 ** (index * 8))) & 0xff);

  const constants = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  const hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  /** 将 32 位字向右循环移位指定的位数。 */
  const rotateRight = (number: number, bits: number): number => (
    (number >>> bits) | (number << (32 - bits))
  );

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const words = new Array<number>(64);
    for (let index = 0; index < 16; index++) {
      const position = offset + (index * 4);
      words[index] = (bytes[position] << 24) | (bytes[position + 1] << 16) | (bytes[position + 2] << 8) | bytes[position + 3];
    }
    for (let index = 16; index < 64; index++) {
      const s0 = rotateRight(words[index - 15], 7) ^ rotateRight(words[index - 15], 18) ^ (words[index - 15] >>> 3);
      const s1 = rotateRight(words[index - 2], 17) ^ rotateRight(words[index - 2], 19) ^ (words[index - 2] >>> 10);
      words[index] = (words[index - 16] + s0 + words[index - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (let index = 0; index < 64; index++) {
      const s1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + choice + constants[index] + words[index]) | 0;
      const s0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + majority) | 0;
      [h, g, f, e, d, c, b, a] = [g, f, e, (d + temp1) | 0, c, b, a, (temp1 + temp2) | 0];
    }
    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }
  return hash.map((word) => (word >>> 0).toString(16).padStart(8, '0')).join('');
}

/**
 * 创建 Itch 游戏库联动支持，并恢复此前生成的全局联动 API。
 *
 * @param options - 游戏库访问、更新和 UI 依赖项。
 * @returns 用于生成并持久化联动码的控制器。
 */
function createItchLinkage({
  getGames,
  addGames,
  updateLibrary,
  showToast
}: ItchLinkageOptions): {
  /** 生成并持久化 itch.io 游戏库联动码。 */
  generateLinkageCode: () => Promise<string>;
} {
  let mousePosition: MousePosition = { x: 0, y: 0 };
  let linkageCode = GM_getValue<string>(ITCH_LINKAGE_CODE_KEY) || '';

  document.addEventListener('mousemove', (event) => {
    mousePosition = { x: event.clientX, y: event.clientY };
  }, { passive: true });

  /** 当存在已保存的联动码时，在 `unsafeWindow` 上暴露当前联动 API。 */
  function exposeLinkage(): void {
    if (!linkageCode) return;
    /** 标记函数；其属性构成页面可见的 Itch 联动 API。 */
    const linkage = function itchLibraryLinkage() {};
    Object.defineProperties(linkage, {
      connected: { enumerable: true, get: () => true },
      has: { enumerable: true, value: (game: unknown) => typeof game === 'string' && getGames().includes(game) },
      get: { enumerable: true, value: () => [...getGames()] },
      add: { enumerable: true, value: (games: string[]) => addGames(games) },
      removeOwned: {
        enumerable: true,
        value: (games: string[]) => Array.isArray(games)
          ? games.filter((game) => !getGames().includes(game))
          : []
      },
      update: { enumerable: true, value: () => updateLibrary(false, 1) }
    });
    unsafeWindow[linkageCode] = linkage;
  }

  /**
   * 对浏览器快照进行哈希，以生成、持久化、暴露并提示用户复制新的联动码。
   *
   * @returns 生成的联动码；哈希失败并显示错误提示后返回空字符串。
   */
  function generateLinkageCode(): Promise<string> {
    const navigatorInfo = navigator as NavigatorWithDeviceMemory;
    const fingerprint = JSON.stringify({
      browser: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages,
        vendor: navigator.vendor
      },
      system: {
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigatorInfo.deviceMemory,
        screen: { width: screen.width, height: screen.height, colorDepth: screen.colorDepth }
      },
      time: new Date().toISOString(),
      window: { innerWidth: window.innerWidth, innerHeight: window.innerHeight, outerWidth: window.outerWidth, outerHeight: window.outerHeight },
      mouse: mousePosition
    });

    return sha256(fingerprint).then((code) => {
      linkageCode = code;
      GM_setValue(ITCH_LINKAGE_CODE_KEY, linkageCode);
      exposeLinkage();
      window.prompt('Itch 联动码已生成并保存，请复制：', linkageCode);
      return linkageCode;
    })
      .catch((error: unknown) => {
        console.error('生成 Itch 联动码失败', error);
        showToast('生成 Itch 联动码失败：浏览器不支持 SHA-256', 'error');
        return '';
      });
  }
  exposeLinkage();
  return { generateLinkageCode };
}

module.exports = { createItchLinkage };
