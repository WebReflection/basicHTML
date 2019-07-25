const {Document, HTMLElement} = require('../basichtml.js');

const document = new Document();
const customElements = document.customElements;

customElements.define('test-component', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `Hello ${this.getAttribute('greet')}!`;
  }
});

document.body.innerHTML = '<test-component greet="David"></test-component>';

console.log(document.toString());

customElements.define('test-node', class extends HTMLElement {

  static get observedAttributes() {
    return ['class', 'test'];
  }

  constructor(...args) {
    super(...args);
    console.log('created');
  }

  connectedCallback() {
    console.log('connected');
  }

  disconnectedCallback() {
    console.log('disconnected');
  }

  attributeChangedCallback() {
    console.log('attributeChanged', arguments);
  }

});

document.body.innerHTML = `<test-node></test-node>`;

const test = document.body.firstChild;
test.setAttribute('nope', 123);
test.setAttribute('test', 123);
test.setAttribute('test', 123);
var attr = test.getAttributeNode('test');
attr.value = 456;
attr = document.createAttribute('test');
test.setAttributeNode(attr);
attr.value = 345;
console.log('');
test.setAttribute('class', 123);
test.setAttribute('class', 123);
attr = test.getAttributeNode('class');
attr.value = 456;
attr = document.createAttribute('class');
test.setAttributeNode(attr);
attr.value = 345;
test.removeAttribute('class');
console.log(test.outerHTML);
document.body.textContent = '';
