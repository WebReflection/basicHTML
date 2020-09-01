const basicHTML = require('../basichtml.js');
const {Document} = basicHTML;
const {document} = basicHTML.init();

const html = "<!DOCTYPE html><html lang='fr'><body><p>Hello</p></body></html>";

const tmp = document.createElement('div');
tmp.innerHTML = html;
const {attributes, children} = tmp.firstElementChild;

document.documentElement.textContent = '';
document.documentElement.attributes = attributes;
document.documentElement.append(...children);
console.assert(document.toString() === createDocumentFromHTML(html).toString());

// const {Document} = require('../basichtml.js');
function createDocumentFromHTML(html, customElements) {
  const document = new Document(customElements);
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const {attributes, children} = tmp.firstElementChild;
  document.documentElement.attributes = attributes;
  document.documentElement.append(...children);
  return document;
}
