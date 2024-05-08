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

const signin = (() => {})();

const poster = { signup, signin };

export default poster;
