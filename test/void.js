const {document} = require('../basichtml.js').init();

document.body.innerHTML = `a <br><div>b <br> c <br /> d</div> e`;

console.assert(document.body.innerHTML === 'a <br /><div>b <br /> c <br /> d</div> e', 'void elements work as expected');
