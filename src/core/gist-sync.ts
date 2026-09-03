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
  /** Opens modal dialogs needed by the Gist synchronization workflow. */
  showDialog: ShowDialog;
  /** Displays user-facing feedback for Gist synchronization outcomes. */
  showToast: ShowToast;
}

/**
 * Reads the saved Gist connection details, supplying empty fields for missing values.
 *
 * @returns The normalized Gist configuration stored in userscript storage.
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
 * Persists Gist connection details in userscript storage.
 *
 * @param conf - The configuration to save.
 */
function setGistConf(conf: GistConf): void {
  GM_setValue(GIST_CONF_KEY, conf);
}

/**
 * Sends a privileged HTTP request and retries failures until the retry budget is exhausted.
 *
 * HTTP responses outside the 2xx–3xx range, network errors, and timeouts all consume one retry.
 *
 * @param options - Request options passed to `GM_xmlhttpRequest`.
 * @param retry - Number of additional attempts allowed after the first attempt.
 * @returns The successful response.
 * @throws The final request error or unsuccessful response when no retries remain.
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
 * Serializes local data and writes it to a file in the configured GitHub Gist.
 *
 * @param token - GitHub personal access token.
 * @param gistId - Target Gist identifier.
 * @param fileName - File in the Gist to replace.
 * @param content - Data to serialize and upload.
 * @returns Whether GitHub confirmed the expected file content after retrying failed requests.
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
 * Fetches and parses a JSON file from a GitHub Gist.
 *
 * @param token - GitHub personal access token.
 * @param gistId - Source Gist identifier.
 * @param fileName - File to retrieve.
 * @returns Parsed remote data, or `false` when the request, response, or content is invalid.
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
 * Creates a labeled input field for the Gist settings dialog.
 *
 * @param labelText - Visible label text.
 * @param value - Initial input value.
 * @param placeholder - Placeholder displayed for an empty input.
 * @param type - HTML input type.
 * @returns The label wrapper and its input element.
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
 * Creates the controller used to configure and synchronize userscript storage with a Gist.
 *
 * @param options - Dialog and toast UI dependencies.
 * @returns A controller that opens the Gist synchronization dialog.
 */
function createGistSyncController({ showDialog, showToast }: GistSyncControllerOptions) {
  /**
   * Checks that every required Gist configuration field has a value.
   *
   * @param conf - Configuration to validate.
   * @returns Whether the configuration can be used for a request.
   */
  function validateConf(conf: GistConf): boolean {
    return Boolean(conf.TOKEN && conf.GIST_ID && conf.FILE_NAME);
  }

  /**
   * Collects all persisted userscript values except the Gist credentials.
   *
   * @returns A storage snapshot suitable for upload.
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
   * Uploads the local storage snapshot and reports validation or sync outcomes through toasts.
   *
   * @param conf - Gist credentials and target file details.
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
   * Downloads remote data, writes each non-credential entry to userscript storage, and shows its outcome.
   *
   * @param conf - Gist credentials and source file details.
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

  /** Opens the Gist settings dialog, including upload, download, save, and connection-test actions. */
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

    /** @returns The trimmed Gist configuration currently entered in the dialog. */
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
