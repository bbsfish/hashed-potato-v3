const loaderview = {
  status: false,
  element: null,
  init: (targetElementId) => {
    loaderview.element = document.querySelector(targetElementId);
    if (!loaderview.element) {
      console.error('[loaderview.js] ERROR on loaderview.init, loaderview.element is undefined');
    } else {
      console.log('[loaderview.js] loaderview.init', loaderview.element);
      loaderview.element.style.display = "none";
    }
  },
  show: () => {
    if (loaderview.status) return;
    const elem = loaderview.element;
    elem.style.display = "flex";
    elem.classList.remove('fadeout');
    loaderview.status = !loaderview.status;
  },
  hide: () => {
    if (!loaderview.status) return;
    const elem = loaderview.element;
    elem.classList.add('fadeout');
    setTimeout(function(){ 
      elem.style.display = "none"; 
    }, 1000);
    loaderview.status = !loaderview.status;
  }
}