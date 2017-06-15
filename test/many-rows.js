const {Document} = require('../basichtml.js');

global.document = new Document;
const hyperHTML = require('hyperhtml');

document.documentElement.innerHTML = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>body { font-family: sans-serif; } .red { color: red; }</style>
    <script src="../hyperhtml.js"></script>
  </head>
  <body>
    <p>Boot speed: <span id='boot'></span></p>
    <div id="example"></div>
  </body>
</html>
`;

const renderer = hyperHTML.bind(document.querySelector('#example'));

const state = {
  start: null,
  items: []
};

function onClick() {
  console.time('items.reverse()');
  state.items.reverse();
  render();
  console.timeEnd('items.reverse()');
}

function render() {
  renderer`
    <div>
      <button onclick="${ onClick }">
        update
      </button>
      <p id='debug'></p>${ 
        state.items.map((item, i) => hyperHTML.wire(item)`
        <h1 class="${ i%2 === 0 ? 'red' : '' }">
            ${ item.name }
          </h1>` 
      )}</div>
  `
}

let amount = 1000;
while(amount--) {
  state.items.push({
    name: `item-${ amount }`
  });
}

setTimeout(onClick, 500); // around 100ms
setTimeout(onClick, 1000);// around 25ms
