function doGet(e) {
  const template = HtmlService.createTemplateFromFile('index');
  const htmlOutput = template.evaluate();
  return htmlOutput;
}
