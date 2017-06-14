const CSS_SPLITTER = /\s*,\s*/;

const escape = require('html-escaper').escape;
const Parser = require('htmlparser2').Parser;
const parseInto = (node, html) => {
  const document = node.ownerDocument;
  const content = new Parser({
    onopentagname(name) {
      node = node.appendChild(document.createElement(name));
    },
    onattribute(name, value) {
      node.setAttribute(name, value);
    },
    oncomment(data) {
      node.appendChild(document.createComment(data));
    },
    ontext(text) {
      node.appendChild(document.createTextNode(text));
    },
    onclosetag(name) {
      node = node.parentNode;
    }
  }, {
    decodeEntities: true,
    xmlMode: true
  });
  content.write(html);
  content.end();
};

const utils = require('./utils');
const Node = require('./Node');
const DOMTokenList = require('./DOMTokenList');

function asNode(node) {
  return typeof node === 'object' ?
    node :
    this.createTextNode(node);
}

function findBySelector(css) {
  switch (css[0]) {
    case '#':
      return this.ownerDocument.getElementById(css.slice(1));
    case '.':
      return this.getElementsByClassName(css.slice(1));
    default:
      return this.getElementsByTagName(css);
  }
}

function matchesBySelector(css) {
  switch (css[0]) {
    case '#': return this.id === css.slice(1);
    case '.': return this.classList.contains(css.slice(1));
    default: return css === this.nodeName;
  }
}

const specialAttribute = (owner, attr) => {
  switch (attr.name) {
    case 'class':
      owner.classList.value = attr.value;
      return true;
  }
  return false;
};

const stringifiedNode = el => {
  switch (el.nodeType) {
    case 1:
      return ('<' + el.nodeName).concat(
        el.attributes.map(stringifiedNode).join(''),
        Element.VOID_ELEMENT.test(el.nodeName) ?
          '/>' :
          ('>' + el.childNodes.map(stringifiedNode).join('') + '</' + el.nodeName + '>')
      );
    case 2:
      return typeof el.value === 'boolean' ?
        (el.value ? (' ' + el.name) : '') :
        (' ' + el.name + '="' + escape(el.value || '') + '"');
    case 3:
      return el.data;
    case 8:
      return '<!--' + el.data + '-->';
  }
};

// interface Element // https://dom.spec.whatwg.org/#interface-element
class Element extends Node {
  constructor(ownerDocument, name) {
    super(ownerDocument);
    this.attributes = [];
    this.nodeType = 1;
    this.nodeName = name;
    this.classList = new DOMTokenList(this);
  }

  getAttribute(name) {
    const attr = this.getAttributeNode(name);
    return attr && attr.value;
  }

  getAttributeNames() {
    return this.attributes.map(attr => attr.name);
  }

  getAttributeNode(name) {
    return this.attributes.find(attr => attr.name === name) || null;
  }

  getElementsByClassName(name) {
    const list = [];
    for (let i = 0; i < this.children.length; i++) {
      let el = this.children[i];
      if (el.classList.contains(name)) list.push(el);
      list.push(...el.getElementsByClassName(name));
    }
    return list;
  }

  getElementsByTagName(name) {
    const list = [];
    for (let i = 0; i < this.children.length; i++) {
      let el = this.children[i];
      if (name === '*' || el.nodeName === name) list.push(el);
      list.push(...el.getElementsByTagName(name));
    }
    return list;
  }

  hasAttribute(name) {
    return this.attributes.some(attr => attr.name === name);
  }

  hasAttributes() {
    return 0 < this.attributes.length;
  }

  closest(css) {
    let el = this;
    do {
      if (el.matches(css)) return el;
    } while ((el = el.parentNode) && el.nodeType === 1);
    return null;
  }

  matches(css) {
    return css.split(CSS_SPLITTER).some(matchesBySelector, this);
  }

  removeAttribute(name) {
    const attr = this.getAttributeNode(name);
    if (attr) {
      this.attributes.splice(this.attributes.indexOf(attr), 1);
      attr.value = null;
      specialAttribute(this, attr);
    }
  }

  setAttribute(name, value) {
    const attr = this.getAttributeNode(name);
    if (attr) {
      attr.value = value;
    } else {
      const attr = this.ownerDocument.createAttribute(name);
      attr.ownerElement = this;
      this.attributes.push(attr);
      attr.value = value;
    }
  }

  setAttributeNode(attr) {
    const name = attr.name;
    const old = this.getAttributeNode(name);
    if (old === attr) return attr;
    else {
      if (attr.ownerElement) {
        if (attr.ownerElement !== this) {
          throw new Error('The attribute is already used in other nodes.');
        }
      }
      else attr.ownerElement = this;
      if (old) {
        this.attributes.splice(this.attributes.indexOf(old), 1, attr);
        if (!specialAttribute(this, attr))
          utils.notifyAttributeChanged(this, name, old.value, attr.value);
        return old;
      } else {
        this.attributes.push(attr);
        if (!specialAttribute(this, attr))
          utils.notifyAttributeChanged(this, name, null, attr.value);
        return null;
      }
    }
  }

  get id() {
    return this.getAttribute('id') || '';
  }

  set id(value) {
    this.setAttribute('id', value);
  }

  get className() {
    return this.classList.value;
  }

  set className(value) {
    this.classList.value = value;
  }

  get innerHTML() {
    return this.childNodes.map(stringifiedNode).join('');
  }

  set innerHTML(html) {
    this.childNodes
      .splice(0, this.childNodes.length)
      .forEach(utils.disconnectChild);
    parseInto(this, html);
  }

  get outerHTML() {
    return stringifiedNode(this);
  }

  // interface ParentNode @ https://dom.spec.whatwg.org/#parentnode
  get children() {
    return this.childNodes.filter(node => node.nodeType === 1);
  }

  get firstElementChild() {
    for (let i = 0, length = this.childNodes.length; i < length; i++) {
      let child = this.childNodes[i];
      if (child.nodeType === 1) return child;
    }
    return null;
  }

  get lastElementChild() {
    for (let i = this.childNodes.length; i--;) {
      let child = this.childNodes[i];
      if (child.nodeType === 1) return child;
    }
    return null;
  }

  get childElementCount() {
    return this.children.length;
  }

  prepend(...nodes) {
    const fragment = this.ownerDocument.createDocumentFragment();
    fragment.childNodes.push(...nodes.map(asNode, this.ownerDocument));
    if (this.childNodes.length) {
      this.insertBefore(fragment, this.firstChild);
    } else {
      this.appendChild(fragment);
    }
  }

  append(...nodes) {
    const fragment = this.ownerDocument.createDocumentFragment();
    fragment.childNodes.push(...nodes.map(asNode, this.ownerDocument));
    this.appendChild(fragment);
  }

  querySelector(css) {
    return this.querySelectorAll(css)[0] || null;
  }

  querySelectorAll(css) {
    return [].concat(...css.split(CSS_SPLITTER).map(findBySelector, this));
  }

};

Element.VOID_ELEMENT = /^area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr$/i;

module.exports = Element;
