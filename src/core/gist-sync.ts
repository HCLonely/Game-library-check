import type { ShowDialog, ShowToast } from '../shared/types';

const GIST_CONF_KEY = 'gistConf';

interface GistConf {
  TOKEN: string;
  GIST_ID: string;
  FILE_NAME: string;
}

interface GistFileResponse {
  content?: string;
}

interface GistResponseBody {
  files?: Record<string, GistFileResponse>;
}

interface GistRequestOptions {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  data?: string;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
}

interface GistSyncControllerOptions {
  /** 打开 Gist 同步流程所需的模态对话框。 */
  showDialog: ShowDialog;
  /** 显示面向用户的 Gist 同步结果反馈。 */
  showToast: ShowToast;
}

/**
 * 读取已保存的 Gist 连接详情，并为缺失值补充空字段。
 *
 * @returns 保存在用户脚本存储中的规范化 Gist 配置。
 */
function getGistConf(): GistConf {
  const conf = GM_getValue<Partial<GistConf>>(GIST_CONF_KEY) || {};
  return {
    TOKEN: conf.TOKEN || '',
    GIST_ID: conf.GIST_ID || '',
    FILE_NAME: conf.FILE_NAME || ''
  };
}

/**
 * 将 Gist 连接详情持久化到用户脚本存储中。
 *
 * @param conf - 要保存的配置。
 */
function setGistConf(conf: GistConf): void {
  GM_setValue(GIST_CONF_KEY, conf);
}

/**
 * 发送特权 HTTP 请求，并在重试次数耗尽前重试失败请求。
 *
 * 2xx–3xx 范围外的 HTTP 响应、网络错误和超时均会消耗一次重试机会。
 *
 * @param options - 传递给 `GM_xmlhttpRequest` 的请求选项。
 * @param retry - 首次尝试后允许的额外尝试次数。
 * @returns 成功的响应。
 * @throws 当没有剩余重试次数时，抛出最终的请求错误或未成功的响应。
 */
function requestWithRetry<TResponse = unknown>(
  options: GistRequestOptions,
  retry = 0
): Promise<GMXmlHttpRequestResponse<TResponse>> {
  return new Promise<GMXmlHttpRequestResponse<TResponse>>((resolve, reject) => {
    GM_xmlhttpRequest<TResponse>({
      ...options,
      onerror: reject,
      ontimeout: reject,
      onload: (response) => {
        response.status >= 200 && response.status < 400 ? resolve(response) : reject(response);
      }
    });
  }).catch((error: unknown) => {
    if (retry <= 0) throw error;
    return requestWithRetry<TResponse>(options, retry - 1);
  });
}

/**
 * 序列化本地数据并将其写入已配置 GitHub Gist 中的文件。
 *
 * @param token - GitHub 个人访问令牌。
 * @param gistId - 目标 Gist 标识符。
 * @param fileName - Gist 中要替换的文件。
 * @param content - 要序列化并上传的数据。
 * @returns 在重试失败请求后，GitHub 是否确认了预期的文件内容。
 */
function setGistData(
  token: string,
  gistId: string,
  fileName: string,
  content: unknown
): Promise<boolean> {
  const data = JSON.stringify({
    files: {
      [fileName]: {
        content: JSON.stringify(content)
      }
    }
  });

  return requestWithRetry<GistResponseBody>({
    url: `https://api.github.com/gists/${gistId}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    },
    data,
    responseType: 'json',
    method: 'PATCH',
    timeout: 30000
  }, 3).then((response) => {
    const body = response.response;
    const remoteContent = body?.files?.[fileName]?.content;
    return response.status === 200 && remoteContent === JSON.stringify(content);
  }).catch((error: unknown) => {
    console.error(error);
    return false;
  });
}

/**
 * 从 GitHub Gist 获取并解析 JSON 文件。
 *
 * @param token - GitHub 个人访问令牌。
 * @param gistId - 源 Gist 标识符。
 * @param fileName - 要获取的文件。
 * @returns 解析后的远程数据；当请求、响应或内容无效时返回 `false`。
 */
function getGistData(token: string, gistId: string, fileName: string): Promise<unknown | false> {
  return requestWithRetry<GistResponseBody>({
    url: `https://api.github.com/gists/${gistId}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    },
    responseType: 'json',
    method: 'GET',
    timeout: 30000
  }, 3).then((response) => {
    if (response.status !== 200) return false;
    const body = response.response;
    const content = body?.files?.[fileName]?.content;
    if (!content) return false;
    return JSON.parse(content);
  }).catch((error: unknown) => {
    console.error(error);
    return false;
  });
}

/**
 * 为 Gist 设置对话框创建带标签的输入字段。
 *
 * @param labelText - 可见的标签文本。
 * @param value - 初始输入值。
 * @param placeholder - 输入为空时显示的占位符。
 * @param type - HTML 输入类型。
 * @returns 标签包装元素及其输入元素。
 */
function createLabeledInput(
  labelText: string,
  value: string,
  placeholder: string,
  type = 'text'
): { wrapper: HTMLLabelElement; input: HTMLInputElement } {
  const wrapper = document.createElement('label');
  wrapper.className = 'glc-form-field';

  const text = document.createElement('div');
  text.className = 'glc-input-label';
  text.textContent = labelText;

  const input = document.createElement('input');
  input.className = 'glc-input';
  input.type = type;
  input.placeholder = placeholder;
  input.value = value;

  wrapper.appendChild(text);
  wrapper.appendChild(input);
  return { wrapper, input };
}

/**
 * 创建用于配置并将用户脚本存储与 Gist 同步的控制器。
 *
 * @param options - 对话框和提示消息 UI 依赖项。
 * @returns 可打开 Gist 同步对话框的控制器。
 */
function createGistSyncController({ showDialog, showToast }: GistSyncControllerOptions) {
  /**
   * 检查每个必填的 Gist 配置字段是否都有值。
   *
   * @param conf - 要验证的配置。
   * @returns 该配置是否可用于请求。
   */
  function validateConf(conf: GistConf): boolean {
    return Boolean(conf.TOKEN && conf.GIST_ID && conf.FILE_NAME);
  }

  /**
   * 收集除 Gist 凭据外的所有持久化用户脚本值。
   *
   * @returns 适合上传的存储快照。
   */
  function buildUploadPayload(): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    const keys = GM_listValues();
    keys.forEach((key) => {
      if (key === GIST_CONF_KEY) return;
      payload[key] = GM_getValue(key);
    });
    return payload;
  }

  /**
   * 上传本地存储快照，并通过提示消息报告验证或同步结果。
   *
   * @param conf - Gist 凭据和目标文件详情。
   */
  async function uploadData(conf: GistConf): Promise<void> {
    if (!validateConf(conf)) {
      showToast('请先保存配置并测试', 'error');
      return;
    }
    const payload = buildUploadPayload();
    const ok = await setGistData(conf.TOKEN, conf.GIST_ID, conf.FILE_NAME, payload);
    if (ok) {
      showToast('同步到 Gist 成功', 'success');
      return;
    }
    showToast('同步到 Gist 失败，请查看控制台错误', 'error');
  }

  /**
   * 下载远程数据，将每个非凭据条目写入用户脚本存储，并显示结果。
   *
   * @param conf - Gist 凭据和源文件详情。
   */
  async function downloadData(conf: GistConf): Promise<void> {
    if (!validateConf(conf)) {
      showToast('请先保存配置并测试', 'error');
      return;
    }
    const remoteData = await getGistData(conf.TOKEN, conf.GIST_ID, conf.FILE_NAME);
    if (!remoteData || typeof remoteData !== 'object') {
      showToast('未检测到远程数据，请检查配置', 'error');
      return;
    }
    Object.entries(remoteData as Record<string, unknown>).forEach(([key, value]) => {
      if (key === GIST_CONF_KEY) return;
      GM_setValue(key, value);
    });
    showToast('从 Gist 同步成功', 'success');
  }

  /** 打开 Gist 设置对话框，其中包含上传、下载、保存和连接测试操作。 */
  function openGistSyncDialog(): void {
    const conf = getGistConf();
    const bodyNode = document.createElement('div');

    const tokenField = createLabeledInput('Github Token', conf.TOKEN, 'Github Token');
    const gistIdField = createLabeledInput('Gist ID', conf.GIST_ID, 'Gist ID');
    const fileNameField = createLabeledInput('文件名', conf.FILE_NAME, '文件名');

    bodyNode.appendChild(tokenField.wrapper);
    bodyNode.appendChild(gistIdField.wrapper);
    bodyNode.appendChild(fileNameField.wrapper);

    const actionRow = document.createElement('div');
    actionRow.className = 'glc-inline-actions';

    const uploadButton = document.createElement('button');
    uploadButton.type = 'button';
    uploadButton.className = 'glc-inline-button';
    uploadButton.textContent = '同步到Gist';

    const downloadButton = document.createElement('button');
    downloadButton.type = 'button';
    downloadButton.className = 'glc-inline-button';
    downloadButton.textContent = '从Gist同步';

    actionRow.appendChild(uploadButton);
    actionRow.appendChild(downloadButton);
    bodyNode.appendChild(actionRow);

    /** @returns 当前在对话框中输入的、已去除首尾空白的 Gist 配置。 */
    const readConfFromInputs = (): GistConf => ({
      TOKEN: tokenField.input.value.trim(),
      GIST_ID: gistIdField.input.value.trim(),
      FILE_NAME: fileNameField.input.value.trim()
    });

    uploadButton.addEventListener('click', () => {
      uploadData(readConfFromInputs());
    });

    downloadButton.addEventListener('click', () => {
      downloadData(readConfFromInputs());
    });

    showDialog({
      title: 'Gist 设置',
      bodyNode,
      confirmText: '保存配置并测试',
      cancelText: '关闭',
      onConfirm: async () => {
        const nextConf = readConfFromInputs();
        setGistConf(nextConf);
        if (!validateConf(nextConf)) {
          showToast('配置不完整，请填写 Token、Gist ID 和文件名', 'error');
          return;
        }
        const ok = await getGistData(nextConf.TOKEN, nextConf.GIST_ID, nextConf.FILE_NAME);
        if (ok !== false) {
          showToast('测试成功', 'success');
          return;
        }
        showToast('测试失败，请检查配置', 'error');
      }
    });
  }

  return {
    openGistSyncDialog
  };
}

module.exports = {
  createGistSyncController,
  getGistConf,
  setGistConf,
  getGistData,
  setGistData
};
