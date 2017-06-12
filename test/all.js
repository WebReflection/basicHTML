const {title, assert, async, log} = require('tressa');
const {CustomElementRegistry, CustomEvent, Document, Event, HTMLElement} = require('../basichtml.js');

title('basicHTML');
assert(
  typeof CustomElementRegistry === 'function' &&
  typeof CustomEvent === 'function' &&
  typeof Document === 'function' &&
  typeof Event === 'function' &&
  typeof HTMLElement === 'function',
  'classes exported'
);

let customElements = new CustomElementRegistry();
let document = new Document(customElements);

assert(
  document.customElements === customElements,
  'a document can share customElements with others'
);

document = new Document();
assert(
  document.customElements !== customElements,
  'a document creates by default its own customElements reference'
);
customElements = document.customElements;

log('## basic element');
let any = document.createElement('any');
assert(
  any instanceof HTMLElement,
  'you can create any element'
);

log('## basic attr');
let attribute = document.createAttribute('test-attribute');
attribute.value = 'some content';
assert(
  attribute.ownerElement === null,
  'attributes do not need an owner element'
);

log('## basic attr + element');
any.setAttributeNode(attribute);
assert(
  attribute.ownerElement === any,
  'but once set these will reflect the owner'
);
assert(
  any.getAttribute('test-attribute') === attribute.value,
  'get and setAttribute works'
);
attribute.value = 'something else';
assert(
  any.getAttribute('test-attribute') === 'something else',
  'attributes direct changes are reflected'
);

any.setAttribute('class', 'a b c');
assert(
  any.classList.value === any.getAttribute('class'),
  'class attribute is reflected through classList'
);

any.classList.toggle('b');
assert(
  any.classList.value === 'a c',
  'toggle works too'
);

any.textContent = 'hello';
assert(
  any.outerHTML === '<any test-attribute="something else" class="a c">hello</any>',
  'nodes can have a text content'
);

any.innerHTML = '<p>OK</p>';
assert(
  any.innerHTML === '<p>OK</p>' &&
  any.outerHTML === '<any test-attribute="something else" class="a c">' + any.innerHTML + '</any>',
  'but also html'
);

log('## document as string');
assert(
  document.toString() === '<!DOCTYPE html><html></html>',
  'document can be represented as a string'
);

log('## document.querySelector');
assert(
  document.querySelector('any') === null,
  'of not appended, a node canot be queried'
);

document.body.appendChild(any);
assert(
  document.querySelector('any') === any,
  'but once in there, everything is fine'
);

log('## text node');
let text = document.createTextNode('Hello');
document.body.appendChild(text);
assert(
  document.body.lastChild === text,
  'also text node can be appended'
);

assert(
  document.body.lastElementChild === any,
  'but not retrieved as element child'
);

log('## node siblings');
assert(
  any.nextSibling === text,
  'nextSibling works as expected'
);
assert(
  text.nextSibling === null,
  'if not present, returns null'
);
assert(
  text.previousSibling === any,
  'previousSibling works as expected'
);
assert(
  document.head.previousSibling === null,
  'if not present, returns null'
);

log('## elements features');
assert(
  document.documentElement.childElementCount === 2,
  'childElementCount works as expected'
);
assert(
  document.documentElement.firstElementChild === document.head,
  'firstElementChild works as expected'
);
assert(
  document.documentElement.lastElementChild === document.body,
  'lastElementChild works as expected'
);

log('## Custom Element');
async(done => {
  customElements.whenDefined('test-node').then(() => {
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
    assert(
      actions.splice(0, actions.length).join(',') ===
      [
        'created',
        'connected',
        'attributeChanged',
        'attributeChanged',
        'attributeChanged',
        'attributeChanged'
      ].join(','),
      'expected actions'
    );
    test.setAttribute('class', 123);
    test.setAttribute('class', 123);
    attr = test.getAttributeNode('class');
    attr.value = 456;
    attr = document.createAttribute('class');
    test.setAttributeNode(attr);
    attr.value = 345;
    test.removeAttribute('class');
    document.body.textContent = '';
    assert(
      actions.splice(0, actions.length).join(',') ===
      [
        'attributeChanged',
        'attributeChanged',
        'attributeChanged',
        'attributeChanged',
        'attributeChanged',
        'disconnected'
      ].join(','),
      'expected actions with class too'
    );
    done();
  });

});

const actions = [];
customElements.define('test-node', class extends HTMLElement {
  static get observedAttributes() {
    return ['class', 'test'];
  }
  constructor(...args) {
    super(...args);
    actions.push('created');
  }
  connectedCallback() {
    actions.push('connected');
  }
  disconnectedCallback() {
    actions.push('disconnected');
  }
  attributeChangedCallback() {
    actions.push('attributeChanged');
  }
});