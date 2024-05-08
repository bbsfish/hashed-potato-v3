const dialog = {
  status: false,
  element: null,
  mainHandler: null, /** @type {function|null} OK ボタンのクリックイベント関数 */
  subHandler: null, /** @type {function|null} キャンセルボタンのクリックイベント関数 */
};

(function() {
  /**
   * ダイアログ要素をメモリに保存する
   * @param {string} elementId ダイアログのもつ ID
   */
  dialog.init = (elementId) => {
    dialog.element = document.querySelector(elementId);
    if (!dialog.element) {
      console.error('[dialog.js] ERROR: dialog.element is undefined');
    } else {
      console.log('[dialog.js] dialog.init', dialog.element);
      dialog.hide();
    }
  }

  /**
   * ダイアログを非表示にする
   */
  dialog.hide = () => {
    if (!dialog.status) return;
    dialog.element.classList.add('hide');
    dialog.element.querySelector('#dialog_mainbtn')
      .removeEventListener('click', dialog.mainHandler);
    dialog.element.querySelector('#dialog_subbtn')
      .removeEventListener('click', dialog.subHandler);
    dialog.status = !dialog.status;
  }

  /**
   * ダイアログを表示する
   * @param {{title: string, message: string,
   *  mainHandler: function, subHandler: function}}
   * mainHandler: OK ボタンのクリックイベント関数, デフォルトは dialog.hide.
   * subHandler: キャンセルボタンのクリックイベント関数, デフォルトは dialog.hide.
   */
  dialog.show = ({
    title,
    message,
    mainHandler = dialog.hide,
    subHandler = dialog.hide,
  }) => {
    if (dialog.status) return;
    dialog.mainHandler = mainHandler;
    dialog.subHandler = subHandler;
    dialog.element.querySelector('#dialog_title')
      .innerText = title;
    dialog.element.querySelector('#dialog_message')
      .innerText = message;
    dialog.element.querySelector('#dialog_mainbtn')
      .addEventListener('click', mainHandler);
    dialog.element.querySelector('#dialog_subbtn')
      .addEventListener('click', subHandler);
    dialog.element.classList.remove('hide');
    dialog.status = !dialog.status;
  }

})();
