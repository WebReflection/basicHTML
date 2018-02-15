const {title, assert, async, log} = require('tressa');
const {Document, Element} = require('../basichtml.js');

const document = new Document();

// Sizzle expectations in a nutshell ...
global.window = global;
global.document = document;
const Sizzle = require('sizzle');
// ... that could be cleaned up right away
delete global.window;
delete global.document;

// plus one method prototype pollution
// querySelector here returns querySelectorAll(...)[0]
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
  'it can retrieve via core unsupported selectors'
);
