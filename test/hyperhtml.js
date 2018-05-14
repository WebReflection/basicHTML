const {Document} = require('../basichtml');
const document = new Document();

// hyperHTML needs at least a global document
// to perform an initial feature detection
global.document = document;
const hyperHTML = require('hyperhtml');

// most basic hyperHTML examples in node
function tick(render) {
  console.log(render`
    <div style=${{margin: 10}}>
      <h1>Hello, world!</h1>
      <h2>It is ${new Date().toLocaleTimeString()}.</h2>
    </div>
  `.innerHTML);
}

// start ticking
setInterval(tick, 1000, hyperHTML.bind(document.body));
