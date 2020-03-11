const {document} = require('../basichtml.js').init();

document.documentElement.innerHTML = `
  <style><!-- comment --></style>
  <textarea><!-- comment --></textarea>
  <textarea>text</textarea>
`;

console.assert(document.querySelector('textarea').childNodes[0].nodeType === 3);
