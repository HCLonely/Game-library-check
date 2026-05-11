const GIST_CONF_KEY = 'gistConf';

function getGistConf() {
  const conf = GM_getValue(GIST_CONF_KEY) || {};
  return {
    TOKEN: conf.TOKEN || '',
    GIST_ID: conf.GIST_ID || '',
    FILE_NAME: conf.FILE_NAME || ''
  };
}

function setGistConf(conf) {
  GM_setValue(GIST_CONF_KEY, conf);
}

function requestWithRetry(options, retry = 0) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...options,
      onerror: reject,
      ontimeout: reject,
      onload: (response) => {
        response.status >= 200 && response.status < 400 ? resolve(response) : reject(response);
      }
    });
  }).catch((error) => {
    if (retry <= 0) throw error;
    return requestWithRetry(options, retry - 1);
  });
}

function setGistData(token, gistId, fileName, content) {
  const data = JSON.stringify({
    files: {
      [fileName]: {
        content: JSON.stringify(content)
      }
    }
  });

  return requestWithRetry({
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
    const body = response?.response;
    const remoteContent = body?.files?.[fileName]?.content;
    return response.status === 200 && remoteContent === JSON.stringify(content);
  }).catch((error) => {
    console.error(error);
    return false;
  });
}

function getGistData(token, gistId, fileName) {
  return requestWithRetry({
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
    const content = response?.response?.files?.[fileName]?.content;
    if (!content) return false;
    return JSON.parse(content);
  }).catch((error) => {
    console.error(error);
    return false;
  });
}

function createLabeledInput(labelText, value, placeholder, type = 'text') {
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

function createGistSyncController({ showDialog, showToast }) {
  function validateConf(conf) {
    return Boolean(conf.TOKEN && conf.GIST_ID && conf.FILE_NAME);
  }

  function buildUploadPayload() {
    const payload = {};
    const keys = GM_listValues();
    keys.forEach((key) => {
      if (key === GIST_CONF_KEY) return;
      payload[key] = GM_getValue(key);
    });
    return payload;
  }

  async function uploadData(conf) {
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

  async function downloadData(conf) {
    if (!validateConf(conf)) {
      showToast('请先保存配置并测试', 'error');
      return;
    }
    const remoteData = await getGistData(conf.TOKEN, conf.GIST_ID, conf.FILE_NAME);
    if (!remoteData || typeof remoteData !== 'object') {
      showToast('未检测到远程数据，请检查配置', 'error');
      return;
    }
    Object.entries(remoteData).forEach(([key, value]) => {
      if (key === GIST_CONF_KEY) return;
      GM_setValue(key, value);
    });
    showToast('从 Gist 同步成功', 'success');
  }

  function openGistSyncDialog() {
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

    const readConfFromInputs = () => ({
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
