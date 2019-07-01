const {title, assert, async, log} = require('tressa');
const HTML = require('../basichtml.js');

HTML.init({
  selector: {
    name: 'sizzle', // will be required
    $(Sizzle, element, css) {
      return Sizzle(css, element);
    }
  }
});

title('basicHTML & Sizzle');
document.documentElement.innerHTML =
`<head><title>sizzle</title></head>
<body><p attr=value>content</p></body>`;

assert(
  document.body.querySelector('[attr="value"]') ===
  document.body.firstElementChild,
  'it can retrieve via core unsupported selectors'
);

// for code coverage sake
global.self = global;
HTML.init();

const {Image} = HTML.init({
  selector: {
    module: () => require('sizzle'),
    $(Sizzle, element, css) {
      return Sizzle(css, element);
    }
  }
});

assert(new Image(3).width === 3);
