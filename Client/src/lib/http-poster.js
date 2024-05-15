/**
 * クライアントからパートナーに POST 送信する
 */
class HttpPoster {
  /**
   * POST 送信先を指定
   * @param {string} endpoint POST 送信先
   */
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  /**
   * POST 情報のテンプレート
   */
  static RESULT = {
    CANCELED: {
      ok: false,
      result: 'CANCELED',
      resultcode: -1,
    },
    AGREED: {
      ok: true,
      result: 'AGREED',
      resultcode: 1,
    },
  };

  /**
   * JSON でデータ送信
   * @param {object} result 結果オブジェクト HttpPoster.RESULT より指定
   * @param {object|null} [payload=null] その他追加情報
   * @returns {boolean} fetch の成否
   */
  async postWithJSON(result, payload = null) {
    try {
      const body = result;
      console.log('body', body);
      if (payload) Object.assign(body, payload);
      console.log('payload', payload);
      if (!body) throw new Error('指定された resultName がありません');
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
/*
function createInput(key, value) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = key;
  input.value = JSON.stringify(value);
  return input;
}

function createForm({ action, status, payload = null }) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action;

  const { ok, result, resultcode } = status;
  form.appendChild(createInput('ok', ok));
  form.appendChild(createInput('result', result));
  form.appendChild(createInput('resultcode', resultcode));

  if (payload) {
    form.appendChild(createInput('body', payload));
  }
  document.body.appendChild(form);
  return form;
}

const signup = (() => {
  function cancel(endpoint) {
    const form = createForm({
      action: endpoint,
      status: {
        ok: false,
        result: 'CANCELED',
        resultcode: -1,
      },
    });
    form.submit();
  }

  function send(endpoint, { id, password }) {
    const form = createForm({
      action: endpoint,
      status: {
        ok: true,
        result: 'AGREED',
        resultcode: 1,
      },
      payload: { id, password },
    });
    form.submit();
  }
  return {
    cancel, send,
  };
})();
*/
export default HttpPoster;
