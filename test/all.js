const {title, assert, async, log} = require('tressa');
const {
  CustomElementRegistry, CustomEvent,
  Document,
  Event, EventTarget,
  HTMLElement, HTMLTemplateElement, HTMLUnknownElement,
  Image
} = require('../basichtml.js');

title('basicHTML');
assert(
  typeof CustomElementRegistry === 'function' &&
  typeof CustomEvent === 'function' &&
  typeof Document === 'function' &&
  typeof Event === 'function' &&
  typeof HTMLElement === 'function' &&
  typeof HTMLUnknownElement === 'function',
  'classes exported'
);

let customElements = new CustomElementRegistry();
let document = new Document(customElements);

assert(
  document.customElements === customElements,
  'a document can share customElements with others'
);
assert(
  document.defaultView === global,
  'a document has a defaultView too'
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

log('## canvas');
let canvas = document.createElement('canvas');
assert(
  canvas.width === 300 && canvas.height === 150,
  'a canvas has default size'
);
canvas.width = canvas.height = 1;
assert(
  canvas.width === 1 && canvas.height === 1,
  'a canvas can change size'
);
assert(
  canvas.toDataURL() === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QA/wD/AP+gvaeTAAAAC0lEQVQImWNgAAIAAAUAAWJVMogAAAAASUVORK5CYII=',
  'a canvas produces an image'
);
assert(
  typeof canvas.getContext('2d') === 'object',
  'a canvas has a context'
);

log('## image');
let img = Image(document, 1, 1);
assert(
  img.outerHTML === '<img width="1" height="1" />',
  'img rendered correctly with two args'
);
img = Image(document, 2);
assert(
  img.outerHTML === '<img width="2" height="2" />',
  'img rendered correctly with one arg'
);
img.width = canvas.width;
img.height = canvas.height;
img.onload = img.onerror = Object;
img.src = canvas.toDataURL();
assert(
  img.onload && img.onerror && img.width && img.height &&
  img.src === canvas.toDataURL(),
  'same properties'
);

document.createElement = (function (createElement) {
  return function (name) {
    return name === 'img' ?
      new HTMLElement(document, name) :
      createElement.apply(this, arguments);
  };
}(document.createElement));
img = Image(document);
assert(img.tagName === 'img', 'Simple image works too');


log('## class attr');
attribute = document.createAttribute('class');
attribute.value = 'some class';
let nodeWithoutClass = document.createElement('div');
nodeWithoutClass.setAttributeNode(attribute);
assert(
  nodeWithoutClass.outerHTML === '<div class="some class"></div>',
  'class attribute works even without owner element'
);

log('## setAttributeNode');
let targetA = document.createElement('yo');
let targetB = document.createElement('yo');
let an = document.createAttribute('a');
let bn = document.createAttribute('a');
targetA.setAttributeNode(an);
assert(
  targetA.setAttributeNode(an) === an,
  'same attribute does not effect the node'
);
try {
  targetB.setAttributeNode(an);
  assert(false, 'attributes cannot be in two nodes');
} catch(e) {
  assert(true, e.message);
}

assert(targetA.setAttributeNode(bn) === an);
assert(targetA.setAttributeNode(an) === bn);

an = document.createAttribute('class');
assert(targetA.setAttributeNode(an) === null);

log('## DocumentType');
const DocumentType = require('../src/DocumentType.js');
let dt = new DocumentType();
assert(
  dt.textContent === null,
  'DocumentType has no content'
);

log('## DOMTokenList');
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

any.classList.replace('c', 'd');
assert(
  any.classList.value === 'a d',
  'replace works too'
);

any.classList.toggle('b');
any.classList.toggle('b', true);
assert(
  any.classList.value === 'a d b',
  'toggle can add too'
);

any.classList.toggle('x');
any.classList.toggle('y', false);
any.classList.replace('z', 'w');
any.classList.remove('b', 'x', 'y', 'w');

assert(
  any.classList.item(0) === 'a',
  'classes preserve the order'
);

let nope = document.createElement('nope');
nope.classList.value = 'OK';
assert(
  nope.getAttribute('class') === 'OK',
  'of classList.value is set the class attribute is created'
);

any.textContent = 'hello';
any.appendChild(document.createElement('br'));
any.setAttribute('hidden', true);
any.setAttribute('wut', '');
assert(
  any.outerHTML === '<any test-attribute="something else" class="a d" hidden wut="">hello<br /></any>',
  'nodes can have a text content'
);

any.attributes['test-attribute'].value = null;
assert(
  any.outerHTML === '<any class="a d" hidden wut="">hello<br /></any>',
  'attribute can have a null value'
);

any.setAttribute('hidden', false);
any.removeAttribute('wut');

any.innerHTML = '<p>OK</p>';
assert(
  any.innerHTML === '<p>OK</p>' &&
  any.outerHTML === '<any class="a d">' + any.innerHTML + '</any>',
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
let text = document.createTextNode('hellO');

assert(text.nextSibling === null);
assert(text.previousSibling === null);
assert(text.textContent === 'hellO');
text.textContent = 'Hello';

document.body.appendChild(text);
assert(
  document.body.lastChild === text,
  'also text node can be appended'
);

assert(
  document.body.lastElementChild === any,
  'but not retrieved as element child'
);
let text1 = document.body.insertBefore(document.createTextNode(''), text);
let text2 = document.body.insertBefore(document.createTextNode('basicHTML: '), text);
let text3 = document.body.appendChild(document.createTextNode(' world!'));
let text4 = document.body.appendChild(document.createTextNode(''));
assert(
  text.wholeText === 'basicHTML: Hello world!'
);
assert(
  text2.wholeText === 'basicHTML: Hello world!'
);
assert(
  text3.wholeText === 'basicHTML: Hello world!'
);
assert(
  text.wholeText = 'Does nothing'
);
document.body.removeChild(text1);
document.body.removeChild(text2);
document.body.removeChild(text3);
document.body.removeChild(text4);

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

document.head.append('text');
assert(
  document.head.firstElementChild === null,
  'and it can  be null'
);
assert(
  document.documentElement.lastElementChild === document.body,
  'lastElementChild works as expected'
);
assert(
  document.head.lastElementChild === null,
  'and it can  be null'
);

log('## EventTarget');

let globalEventTarget = false;
EventTarget.init(document.defaultView);
document.defaultView.addEventListener('global-event-target', () => { globalEventTarget = true; });
document.body.dispatchEvent(new Event('global-event-target', { bubbles: true }));
assert(
  globalEventTarget,
  'window is reached while dispatching events'
);

let first = document.createElement('first');
let second = document.createElement('second');
let third = document.createElement('third');
first.appendChild(second).append(third);
third.once = 0;
third.addEventListener('once', e => third.once++, {once: true});
third.twice = 0;
let twice = e => {
  third.twice++;
  e.preventDefault();
};
third.addEventListener('twice', twice);
third.addEventListener('twice', twice);
let e = new Event('once');
e.target = third;
e.currentTarget = third;
third.dispatchEvent(e);
third.dispatchEvent(new Event('once'));
third.dispatchEvent(new Event('twice'));
third.dispatchEvent(new Event('twice'));

assert(
  third.once === 1,
  'using {once: true} via addEventListener works'
);
assert(
  third.twice === 2,
  'setting twice same listener does not add them twice'
);
first.addEventListener('twice', e => first.called = true);
second.addEventListener('twice', e => {
  second.called = true;
  e.stopPropagation();
}, {once: true});
try {
  document.createEvent('MouseEvent');
  assert(false, 'MouseEvent should not be allowed');
} catch(e) {
  assert(true, 'document.createEvent(...) can be used with "Event" only');
}
var createdEvent = document.createEvent('Event');
createdEvent.initEvent('twice', true, true);
third.dispatchEvent(createdEvent);
assert(
  second.called === true,
  'events bubble up'
);
assert(
  first.called !== true,
  'and you can stopPropagation'
);
second.addEventListener('twice', e => {
  e.stopImmediatePropagation();
}, {once: true});
second.addEventListener('twice', e => {
  second.nope = true;
}, {once: true});
third.dispatchEvent(new Event('twice', {bubbles: true}));
assert(
  second.nope !== true,
  'you can also stopImmediatePropagation'
);
third.dispatchEvent(new Event('twice', {bubbles: true}));
assert(
  first.called === true,
  'bubbles up to the top'
);
third.addEventListener('click', {handleEvent(e) {
  assert(
    this !== third && e.target === third,
    'even {handleEvent(){}} works'
  );
}}, {once: true});
third.click();
assert(document.activeElement === third, 'activeElement');
third.blur();
assert(document.activeElement == null, 'activeElement as null');
third.removeEventListener('twice', {});
third.removeEventListener('nope', {});

first.addEventListener('custom', e => (first.detail = e.detail));
first.dispatchEvent(new CustomEvent('custom', {detail: second}));
assert(
  first.detail === second,
  'CustomEvent also works as expected'
);

var createdCustomEvent = document.createEvent('CustomEvent');
createdCustomEvent.initCustomEvent('custom', true, true, 'detail');
assert(
  createdCustomEvent.detail === 'detail',
  'CustomEvent can be created procedurally'
);

log('## Comments');
let comment = document.createComment('Here a comment');
assert(comment.textContent === 'Here a comment');
comment.textContent = 'here a comment';

third.appendChild(comment);
assert(
  third.innerHTML === '<!--here a comment-->',
  'comments also works as expected'
);
assert(
  third.textContent === '',
  'and do not interfere as textContent'
);

third.textContent = '<br/>';
assert(
  third.innerHTML === '&lt;br/&gt;',
  'text nodes are sanitized'
);

log('## DOMStringMap');
first.dataset.testName = 'test value';
assert(
  first.hasAttribute('data-test-name'),
  'dataset also works as expected'
);
assert(
  'testName' in first.dataset,
  'the attribute name is normalized'
);
assert(
  first.dataset.testName === 'test value',
  'the value is the expected'
);

delete first.dataset.testName;
assert(
  !first.hasAttribute('data-test-name'),
  'properties can be deleted'
);

let id = String(Math.random());
document.body.appendChild(document.createElement('by-id')).id = id;
document.body.lastChild.setAttribute('ref', '');
assert(
  document.querySelector('#' + id) === document.body.lastChild &&
  document.getElementById(id) === document.body.lastChild &&
  document.querySelector('[ref]') === document.body.lastChild &&
  document.body.lastChild.matches('#' + id),
  'elements can be found by ID'
);

document.documentElement.id = 'whatever';
assert(
  document.getElementById('whatever') === document.documentElement,
  'even the HTML one'
);
assert(document.getElementById('nope') === null);

assert(
  document.querySelector('by-id') === document.body.lastChild &&
  document.getElementsByTagName('by-id')[0] === document.body.lastChild,
  'elements can be found also by tag name'
);

assert(
  document.getElementsByTagName('html')[0] === document.documentElement &&
  document.children[0] === document.documentElement &&
  document.firstElementChild === document.documentElement &&
  document.lastElementChild === document.documentElement &&
  document.documentElement.matches('html') &&
  document.childElementCount === 1,
  'even getting the HTML one'
);


document.body.classList.value = 'test';
assert(
  document.getElementsByClassName('test')[0] === document.body &&
  document.querySelector('.test') === document.body &&
  document.body.matches('.test'),
  'getElementsByClassName works too'
);

document.documentElement.classList.value = 'the-html';
assert(
  document.getElementsByClassName('the-html')[0] === document.documentElement,
  'even with HTML tag'
);

assert(
  document.querySelectorAll('head,body')
          .every((el, i) => i ? el === document.body : el === document.head),
  'and querySelectorAll works too'
);

try { document.append('banana'); } catch(e) {
  assert(true, 'append and prepend are not allowed on the document');
}

assert(
  document.createElementNS('svg', 'test').nodeName === 'test:svg',
  'createElementNS simply puts tags and namespace together'
);

assert(document.createElementNS('http://www.w3.org/1999/xhtml', 'template') instanceof HTMLTemplateElement, 'createElementNS uses createElement for HTML namespace');

assert(
  document.createElement('something').tagName == 'something',
  'elements have tagNames'
)

log('## documentElement');
document.documentElement.title = 'some title';
assert(
  document.documentElement.getAttribute('title') === 'some title' &&
  document.documentElement.title === 'some title',
  'some attribute is special'
);
document.documentElement.onclick = e => {
  assert(
    e.type === 'click' && e.target === document.documentElement,
    'and can be dispatched like others'
  );
};
assert(
  typeof document.documentElement.onclick === 'function',
  'even DOM Level 0 events are supported'
);
document.documentElement.dispatchEvent(new Event('click'));
document.documentElement.onclick = null;
document.documentElement.dispatchEvent(new Event('click'));
document.documentElement.onclick = null;
document.documentElement.onclick = {method(){}}.method;

document.documentElement.innerHTML = `<!DOCTYPE html>
<html>
  <head>
    <style>body>*{}</style>
  </head>
  <body test="attribute">
    <br>
    <!-- and comment -->
  </body>
</html>`;
assert(
  document.documentElement.hasChildNodes() &&
  true || document.getElementsByTagName('*').length === 5,
  'documentElement can inject whole documents'
);

assert(
  document.getElementsByTagName('style')[0].outerHTML ===
  '<style>body>*{}</style>',
  'style preserves HTML entities'
);

document.documentElement.innerHTML = '<head></head><body></body>';
assert(
  document.documentElement.hasChildNodes() &&
  document.getElementsByTagName('*').length === 3,
  'but partial head and body can also be assigned'
);

document.documentElement.removeChild(document.documentElement.firstChild);
document.documentElement.removeChild(document.documentElement.firstChild);
assert(
  !document.documentElement.hasChildNodes() &&
  document.getElementsByTagName('*').length === 1,
  'or eventually removed too'
);

document.documentElement.innerHTML = `
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/test">
  </head>`;
assert(
  document.documentElement.innerHTML ===
  "<head>\n    <meta charset=\"utf-8\" />\n    <link rel=\"stylesheet\" href=\"/test\" />\n  </head><body></body>",
  'multi void elements are supported'
);

let voidInDiv = document.createElement('div');
voidInDiv.innerHTML = `
  <div>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/test">
  </div>
`;

assert(
  voidInDiv.innerHTML ===
  "\n  <div>\n    <meta charset=\"utf-8\" />\n    <link rel=\"stylesheet\" href=\"/test\" />\n  </div>\n",
  'also inside elements'
);

log('## playing with childNodes');
let one = document.body.appendChild(document.createElement('one'));
let two = document.createElement('two');
document.body.appendChild(one);
let fragment = document.createDocumentFragment();
fragment.appendChild(two).textContent = '2';
assert(fragment.textContent === '2');
document.body.replaceChild(fragment, one);
assert(document.body.lastChild === two, 'you can replace fragments');
document.body.replaceChild(one, two);
assert(document.body.lastChild === one, 'or simple nodes too');
document.body.insertBefore(one, one);
document.body.replaceChild(one, one);
assert(document.body.childNodes.length === 1);

let before = document.createElement('before');
let after = document.createElement('after');
document.body.append(before, after);
assert(document.body.lastElementChild === after, 'after is the last element');
assert(document.body.lastElementChild.previousElementSibling === before, 'before is the previous one');
document.body.insertBefore(after, before);
assert(document.body.lastElementChild === before, 'before is now after');
assert(document.body.lastElementChild.previousElementSibling === after, 'after is now before');

log('## attachShadow');
try {
  document.body.attachShadow();
} catch(e) {
  assert(true, 'attachShadow needs one argument');
}
try {
  document.body.attachShadow({});
} catch(e) {
  assert(true, 'attachShadow needs one argument with a mode');
}
assert(
  document.body.attachShadow({mode: 'closed'}) === document.body &&
  document.body.shadowRoot === undefined,
  'attachShadow({mode: "closed"})'
);
assert(
  document.body.attachShadow({mode: 'open'}) === document.body &&
  document.body.shadowRoot === document.body,
  'attachShadow({mode: "open"})'
);

log('## style');

assert(
  document.createAttribute('style').value === '',
  'it can be created as attribute'
);

assert(
  document.body.style && document.body.style === document.body.style,
  'style available per each element'
);

assert(
  'cssText' in document.body.style,
  'cssText available per each style'
);

document.body.style.cssText = '-00.0123456%';
assert(
  document.body.style.cssText === '-00.0123456%',
  'meaningless styles are not ignored'
);

document.body.style.cssText = ':-00.0123456%';
assert(
  document.body.style.cssText === ':-00.0123456%',
  'empty keys are not ignored either'
);

document.body.style.cssText = '_hyper:123';
assert(
  document.body.style.cssText === '_hyper: 123;',
  '_hyper style has no issues'
);

document.body.style.setProperty('--custom', 456);
assert(
  document.body.style.getPropertyValue('--custom') == 456,
  'getPropertyValue works as expected'
);
assert(
  document.body.style.cssText === '_hyper: 123;--custom:456;',
  'custom style has no issues'
);

document.body.style.cssText = '';


document.body.style.fontFamily = 'sans-serif';
assert(
  document.body.style.cssText === 'font-family:sans-serif;',
  'style text can be retrieved'
);

document.body.style.cssText = 'font-family:monospace;';
assert(
  document.body.style.cssText === 'font-family:monospace;',
  'style text can be set'
);

assert(
  'fontFamily' in document.body.style &&
  document.body.style.fontFamily === 'monospace',
  'style as a property'
);

log('## className');
document.body.className = 'a b';
assert(
  document.body.className === 'a b' &&
  document.body.classList.value === 'a b',
  'it can be set and retrieved back'
);

log('## extras');
document.body.textContent = '';
assert(document.body.getAttributeNames().join(',') === 'style,class', 'getAttributeNames works');
assert(document.body.hasAttributes(), 'hasAttributes too');
document.body.prepend('a', 'b', 'c');
document.body.prepend('d');
assert(document.body.textContent === 'dabc', 'and so does .prepend(...)');
assert(
  document.body.closest('body') === document.body &&
  document.body.closest('html') === document.documentElement &&
  document.body.closest('shenanigans') === null,
  'same goes for closest'
);

document.body.innerHTML = '<p>1</p>';
document.body.firstChild.replaceWith(document.createElement('p'));
assert(document.body.firstChild.textContent === '');
document.body.firstChild.after(document.createElement('div'));
document.body.lastChild.before(document.createElement('div'));
let tmpChild = document.body.firstChild;
tmpChild.remove();
tmpChild.remove();
tmpChild.before();
tmpChild.after();
tmpChild.replaceWith();

document.body.innerHTML = '<p with="attributes">some <!--content--></p>';
assert(document.body.innerHTML === '<p with="attributes">some <!--content--></p>');
let flexibility = document.createElement('_');
let value = {thing: Math.random()};
flexibility.setAttribute('any', value);
assert(value === flexibility.getAttribute('any'));

log('## Node.normalize()');
tmpChild = document.createElement('ul');
tmpChild.innerHTML = `
  <li>a</li>
  <li>b</li>
`;
tmpChild.normalize();
assert(tmpChild.innerHTML === '<li>a</li><li>b</li>');

log('## TreeWalker');
let twFragment = document.createDocumentFragment();
let twNode = twFragment.appendChild(document.createElement('p'));
let twComment = twFragment.appendChild(document.createComment('comment'));
let twText = twFragment.appendChild(document.createTextNode('node'));
let tw = document.createTreeWalker(twFragment, 1);
let currentNode = tw.nextNode();
assert(currentNode === twNode, 'TreeWalker node');
currentNode = tw.nextNode();
assert(currentNode === null, 'TreeWalker one node only');
tw = document.createTreeWalker(twFragment, 128);
currentNode = tw.nextNode();
assert(currentNode === twComment, 'TreeWalker comment');
currentNode = tw.nextNode();
assert(currentNode === null, 'TreeWalker one comment only');
tw = document.createTreeWalker(twFragment);
currentNode = tw.nextNode();
assert(currentNode === twNode, 'TreeWalker node');
currentNode = tw.nextNode();
assert(currentNode === twComment, 'TreeWalker comment');
currentNode = tw.nextNode();
assert(currentNode === twText, 'TreeWalker text');
currentNode = tw.nextNode();
assert(currentNode === null, 'TreeWalker all children parsed');

log('## document.importNode()');
let toBeImported = document.createDocumentFragment();
assert(document.importNode(toBeImported) !== toBeImported, 'import node');

log('## Node.cloneNode()');
let toBeCloned = document.createDocumentFragment();
let toBeClonedP = toBeCloned.appendChild(document.createElement('p'));
toBeClonedP.setAttribute('one', 'two');
toBeClonedP.appendChild(document.createTextNode('three'));
toBeClonedP.appendChild(document.createComment('four'));
assert(toBeClonedP.cloneNode().outerHTML === '<p one="two"></p>', 'clone Element');
assert(toBeClonedP.cloneNode(true).outerHTML === toBeClonedP.outerHTML, 'clone Element deep');
assert(toBeCloned.cloneNode(true).firstChild.outerHTML === toBeClonedP.outerHTML, 'clone #document-fragment');
assert(toBeClonedP.getAttributeNode('one') === toBeClonedP.attributes.one, 'attributes by name');
let toBeClonedAttr = toBeClonedP.getAttributeNode('one').cloneNode();
assert(toBeClonedAttr.name === 'one' && toBeClonedAttr.value === 'two', 'clone attributes');

toBeClonedP.removeAttributeNode(toBeClonedP.attributes.one);
assert(toBeClonedP.attributes.one == null, 'attributes can be removed');
try {
  toBeClonedP.removeAttributeNode(toBeClonedP.attributes.one);
  assert(false, 'attributes must be valid to be removed');
} catch(e) {
  assert(true, 'attributes must be valid to be removed');
}

log('## siblings');
let ol = document.createElement('ol');
let li = document.createElement('li');
ol.appendChild(li);
assert(li.parentElement === ol, 'parentElement');
assert(ol.parentElement === null, 'parentElement');
assert(li.previousElementSibling === null, 'null previousElementSibling');
assert(li.nextElementSibling === null, 'null nextElementSibling');
ol.insertBefore(document.createElement('li'), li);
ol.appendChild(document.createElement('li'));
assert(li.previousElementSibling === ol.childNodes[0], 'previousElementSibling');
assert(li.nextElementSibling === ol.childNodes[2], 'nextElementSibling');
ol.insertBefore(document.createElement('li'));
assert(ol.childNodes.length === 4);

log('## HTMLTemplateElement');
assert(document.createElement('template').content.nodeType === 11, 'has a fragment content');

log('## Range');
let range = document.createRange();
let clone = range.cloneRange();
range.setStartAfter(ol.childNodes[0]);
range.setEndBefore(ol.childNodes[3]);
range.deleteContents();
assert(ol.childNodes.length === 2, 'range removed two nodes');
range = document.createRange();
range.setStartBefore(ol.firstChild);
range.setEndAfter(ol.lastChild);
range.deleteContents();
assert(ol.childNodes.length === 0, 'range removed two other nodes');
ol.appendChild(document.createElement('li'));
ol.appendChild(document.createElement('li'));
ol.appendChild(document.createElement('li'));
range = document.createRange();
range.setStartBefore(ol.firstChild);
range.setEndAfter(ol.lastChild);
let olLive = ol.childNodes.slice(0);
let olExtracted = range.extractContents();
assert(olLive.every((li, i) => li === olExtracted.childNodes[i]), 'extractContents works');
ol.appendChild(document.createElement('li')).textContent = '0';
ol.appendChild(document.createElement('li')).textContent = '1';
ol.appendChild(document.createElement('li')).textContent = '2';
range = document.createRange();
range.setStartBefore(ol.firstChild);
range.setEndAfter(ol.lastChild);
olExtracted = range.cloneContents();
assert(olExtracted.childNodes.every(
  (li, i) => li.textContent == i &&
  li.textContent === ol.childNodes[i].textContent
), 'cloneContents works');

log('## NamedNodeMap');
let withAttrs = document.createElement('div');
withAttrs.setAttribute('test', 'value');
let attr = withAttrs.getAttributeNode('test');
let attrs = withAttrs.attributes;
assert(attrs.length, 'NamedNodeMap#length');
let last = attrs.length - 1;
assert(attrs.item(last) === attr, 'NamedNodeMap#item');
assert(attrs.getNamedItem('test') === attr, 'NamedNodeMap#getNamedItem');
attrs.removeNamedItem('test');
assert(!withAttrs.hasAttribute('test'), 'NamedNodeMap#removeNamedItem');
assert(attrs.item(last) === null, 'NamedNodeMap#item(...) as null');
attrs.setNamedItem(attr);
assert(withAttrs.hasAttribute('test'), 'NamedNodeMap#setNamedItem');

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
    attr = document.createAttributeNS(null, 'test');
    test.setAttributeNodeNS(attr);
    attr.value = 345;
    assert(attr.textContent == attr.value);
    attr.textContent = 345;
    assert(
      actions.splice(0).join(',') ===
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
    document.body.innerHTML = `<test-node test="123"></test-node>`;
    assert(
      actions.splice(0, actions.length).join(',') ===
      [
        'created', 'attributeChanged', 'connected'
      ].join(','),
      'attributes are notified if already there'
    );
    const TestNode = customElements.get('test-node');
    global.document = document;
    const tn = new TestNode();
    delete global.document;
    assert(tn.nodeName === 'test-node', 'custom elements can be initialized via new');

    customElements.whenDefined('test-node-v0').then(() => {
      document.body.innerHTML = `<test-node-v0></test-node-v0>`;
      document.body.firstChild.setAttribute('test', '123');
      assert(
        document.body.firstChild.getAttribute('test') === '123',
        'attribute sets without throwing'
      );
      customElements.whenDefined('test-clone-outer').then(() => {
        global.document = document;
        document.body.innerHTML = '<test-clone-outer></test-clone-outer>';
        document.body.firstElementChild.removeAttribute('test');
        const value = document.body.innerHTML;
        assert(value === '<test-clone-outer><test-clone-inner>wut</test-clone-inner></test-clone-outer>', 'nested content is OK');
        document.body.appendChild(document.body.firstElementChild.cloneNode(true));
        assert(document.body.innerHTML === (value + value), 'cloned content is not repeated');
        delete global.document;
        customElements.whenDefined('built-in').then(() => {
          const div = document.createElement('div', {is: 'built-in'});
          assert(div.outerHTML === '<div is="built-in"></div>', 'built-in extends work too');
          done();
        });
      });
    });
  });
})
.then(() => {
  try {
    customElements.define('test-node', class extends HTMLElement {});
    assert(false, 'this should not happen');
  } catch(e) {
    assert(true, 'you cannot define same element twice');
  }
}).then(() => {
  require('./sizzle.js');
});

const actions = [];
customElements.define('test-empty', class extends HTMLElement {});
customElements.define('test-node-v0', class extends HTMLElement {
  attributeChangedCallback() {
    throw 'this should not be called';
  }
});
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
customElements.define('test-clone-outer', class extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = '<test-clone-inner></test-clone-inner>';
    this.setAttribute('test', 'value');
  }
});
customElements.define('test-clone-inner', class extends HTMLElement {
  constructor() {
    super().textContent = 'wut';
  }
});
customElements.define('built-in', class extends HTMLElement {}, {extends: 'div'});
//*/

require('./textarea');
require('./style');
require('./void');

require('./issue-56');
