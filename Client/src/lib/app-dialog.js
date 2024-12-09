/* eslint-disable */
const dialog = (() => {
  const wrp = {
    // Parent / マウントされる親要素
    prt: null,
    // ダイアログ要素
    dialog: null,
    // イベントハンドラー
    handlers: {
      onsubmit: null,
      onreset: null,
    }
  }

  wrp.mount = (elementId) => {
    const outer = document.querySelector(elementId);
    const innerWrp = (() => {
      const elem = document.createElement('div');
      elem.id = 'app-dialog';
      return elem;
    })();
    wrp.prt = innerWrp;
    outer.appendChild(innerWrp);
    console.debug('[app-dialog.js] Dialog is mounted at', outer);
  }

  wrp.create = () => {
    wrp.dialog = document.createElement('dialog');
    wrp.dialog.innerHTML = `
      <form method="dialog">
        <div id="app-dialog-header">
          <svg id="app-dialog-xmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
        </div>
        <div id="app-dialog-body">
          <p id="app-dialog-message"></p>
        </div>
        <div id="app-dialog-footer">
          <button id="app-dialog-reset" type="reset">Cancel</button>
          <button id="app-dialog-submit" type="submit">OK</button>
        </div>
      </form>
    `;
    wrp.prt.appendChild(wrp.dialog);
    console.log('[app-dialog.js] Dialog is created', wrp.dialog);
  }

  wrp.setMessage = (message) => {
    wrp.dialog.querySelector('#app-dialog-message').innerText = message;
  }

  wrp.setEventHandler = ({ onsubmit, onreset }) => {
    wrp.handlers.onsubmit = (e) => {
      e.preventDefault();
      wrp.destroy();
      onsubmit(e);
    };
    wrp.dialog.querySelector('#app-dialog-submit')
      .addEventListener('click', wrp.handlers.onsubmit);
    wrp.handlers.onreset = (e) => {
      e.preventDefault();
      wrp.destroy();
      onreset(e);
    };
    wrp.dialog.querySelector('#app-dialog-reset')
      .addEventListener('click', wrp.handlers.onreset);
    wrp.dialog.querySelector('#app-dialog-xmark')
      .addEventListener('click', wrp.handlers.onreset);
    wrp.dialog.addEventListener('close', wrp.handlers.onreset);
  }

  wrp.appendElementIntoBody = (element) => {
    wrp.dialog.querySelector('#app-dialog-body').appendChild(element);
  }

  wrp.showPrompt = (message) => new Promise((resolve, reject) => {
    wrp.create();
    wrp.setMessage(message);
    const input = (() => {
      const elem = document.createElement('input');
      elem.type = 'text';
      elem.id = 'app-dialog-input';
      elem.autocomplete = 'off';
      return elem;
    })();
    wrp.appendElementIntoBody(input);
    wrp.setEventHandler({
      onsubmit: (e) => resolve(input.value),
      onreset: (e) => resolve(null),
    });
    wrp.dialog.showModal();
  })

  wrp.showConfirm = (message) => new Promise((resolve, reject) => {
    wrp.create();
    wrp.setMessage(message);
    wrp.setEventHandler({
      onsubmit: (e) => resolve(true),
      onreset: (e) => resolve(false),
    });
    wrp.dialog.showModal();
  });

  wrp.showAlert = (message) => new Promise((resolve, reject) => {
    wrp.create();
    wrp.setMessage(message);
    // Reset ボタンは不要
    wrp.dialog.querySelector('#app-dialog-reset').style.display = 'none';
    wrp.setEventHandler({
      onsubmit: (e) => resolve(true),
      onreset: (e) => resolve(false),
    });
    wrp.dialog.showModal();
  });

  wrp.destroy = () => {
    wrp.dialog.remove();
    wrp.dialog.querySelector('#app-dialog-reset')
      .removeEventListener('click', wrp.handlers.onreset);
    wrp.dialog.removeEventListener('close', wrp.handlers.onreset);
    wrp.handlers.onreset = null;
    wrp.dialog.querySelector('#app-dialog-submit')
      .removeEventListener('click', wrp.handlers.onsubmit);
    wrp.handlers.onsubmit = null;
  }

  return wrp;
})();

dialog.mount('body');

export default {
  install: (app, options) => {
    app.config.globalProperties.$dialog = {
      confirm: async ({ message = 'This is confirm. ok?' }) => {
        return new Promise(async (resolve, reject) => {
          const result = await dialog.showConfirm(message);
          dialog.destroy();
          resolve(result);
        });
      },

      prompt: async ({ message = 'This is prompt', forceNull = false }) => {
        return new Promise(async (resolve, reject) => {
          const result = await dialog.showPrompt(message);
          if (forceNull && result == '') resolve(null);
          else resolve(result);
          dialog.destroy();
        });
      },

      alert: async ({ message = 'This is prompt' }) => {
        return new Promise(async (resolve, reject) => {
          const result = await dialog.showAlert(message);
          resolve(result);
          dialog.destroy();
        });
      },

    }
  },
};
