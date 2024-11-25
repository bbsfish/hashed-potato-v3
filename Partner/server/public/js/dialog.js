const dialog = {
  status: false,
  element: null,
  mainHandler: null,
  subHandler: null,
  init: (targetElementId) => {
    dialog.element = document.querySelector(targetElementId);
    if (!dialog.element) {
      console.error('[dialog.js] ERROR on dialog.init, dialog.element is undefined');
    } else {
      console.log('[dialog.js] dialog.init', dialog.element);
    }
  },
  close: () => {
    if (!dialog.status) return;
    const elem = dialog.element;
    elem.classList.add('hide');
    elem.querySelector('#hsp_dialog_mainbtn').removeEventListener('click', dialog.mainHandler);
    elem.querySelector('#hsp_dialog_subbtn').removeEventListener('click', dialog.subHandler);
    dialog.status = !dialog.status;
  },
  show: ({ title, message, mainHandler = dialog.close, subHandler = dialog.close }) => {
    if (dialog.status) return;
    const elem = dialog.element;
    dialog.mainHandler = mainHandler;
    dialog.subHandler = subHandler;
    elem.querySelector('#hsp_dialog_title').innerText = title;
    elem.querySelector('#hsp_dialog_message').innerText = message;
    elem.querySelector('#hsp_dialog_mainbtn').addEventListener('click', mainHandler);
    elem.querySelector('#hsp_dialog_subbtn').addEventListener('click', subHandler);
    elem.classList.remove('hide');
    dialog.status = !dialog.status;
  },
};