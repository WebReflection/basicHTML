const {Document} = require('../basichtml.js');

const document = new Document();

document.documentElement.innerHTML = '<Page><Label text="1"/><Label text="2"/></Page>';
console.log(document.toString());