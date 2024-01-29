const app = {
  view: 'TopView',
  target: document.querySelector('#main'),
  isTemplateAccess: 'content' in document.createElement('template')
};

app.onload = function () {
  const template = document.querySelector(`#${app.view}`);
  const clone = template.content.cloneNode(true);
  app.target.appendChild(clone);
};
