const hsp = {
  stockURL: 'https://script.google.com/macros/s/AKfycbyUVtwxdl5rHLM1TTeLsSVidti3OdsHZQVEH1D_Z7hpFNwQ_CPK_Gi0WlUC7Dki7IJQ/exec',
  /**
   * @type {string} '%%type' が (リクエスト) type に、'%%rid' が requester_id にマッチ
   */
  clientURL: 'http://localhost:8080/#/%%type/%%rid',
  options: {
    /** @type {string} Requester ID */
    requester_id: 'sample-online-mall',

    /** @type {string[]} Scope: 'nickname', 'email', 'phonenumber */
    scope: ['nickname'],

    /** @type {string[]} */
    self_request_auth: 'temp_token',

    /** @type {string[]} */
    self_request_auth_value: '123456',
  },
  configs: {
    /**
     * Redirect URI の origin 部分
     * @type {string} 'auto' = window.location.origin で補完
     */
    origin: 'auto',

    /** @type {string} Redirect URI の pathname 部分 */
    pathname: '/%%type',
  },
  _rid: null,
}

/**
 * Option 生成
 * @param {string} type Request Type: 'signin', 'signup'
 */
hsp.bindOption = (type) => {
  const opts = {};
  opts.type = type;
  const pathname = hsp.configs.pathname.replace(/%%type/g, type)
  if (hsp.configs.origin == 'auto') {
    opts.redirect_uri = `${window.location.origin}${pathname}`;
  } else {
    opts.redirect_uri = `${hsp.configs.origin}${pathname}`;
  }
  Object.assign(hsp.options, opts);
  console.debug('[hsp.js] bindOption', hsp.options);
  return opts;
}

/**
 * clientURL に type と rid (受付 ID) を補完した URL を生成
 * @param {string} [type=hsp.options.type]
 * @param {string} [rid=hsp._rid]
 * @returns {string} 生成された URL
 */
hsp.bindClientURL = (type = hsp.options.type, rid = hsp._rid) => {
  const url = hsp.clientURL;
  return url
    .replace(/%%type/g, type)
    .replace(/%%rid/g, rid);
};

/**
 * リクエストをエージェントに登録します
 * bindOption をすでに呼び出していないといけない
 * @returns {Promise<string|null>} 成功すれば reception_id, それ以外は null を返す
 */
hsp.stock = async () => {
  const opts = hsp.options;
  try {
    const body = new FormData();
    const keys = Object.keys(opts);
    keys.forEach((key) => {
      body.append(key, opts[key]);
    });
    const response = await fetch(hsp.stockURL, {
      method: 'POST',
      body,
    });
    const resdata = await response.json();
    if ('reception_id' in resdata) {
      hsp._rid = resdata.reception_id;
      return resdata.reception_id;
    } else {
      console.error(resdata);
      throw null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

