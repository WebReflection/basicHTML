const {title, assert, async, log} = require('tressa');
const {Document, Element} = require('../basichtml.js');

global.window = global;
global.document = new Document();

const Sizzle = require('sizzle');
Element.prototype.querySelectorAll = function (css) {
  return Sizzle(css, this);
};

title('basicHTML & Sizzle');
document.documentElement.innerHTML =
`<head><title>sizzle</title></head>
<body><p attr=value>content</p></body>`;

assert(
  document.body.querySelector('[attr="value"]') ===
  document.body.firstElementChild,
  'it can retrieve via unsupported selectors'
);
