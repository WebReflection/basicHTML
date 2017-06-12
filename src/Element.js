const CSS_SPLITTER = /\s*,\s*/;
// TODO: improve
const NO_CLOSING_TAG = /br|hr|img/;

const escape = require('html-escaper').escape;
const parse = require('parse5').parseFragment;

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
    default: return css.toUpperCase() === this.nodeName;
  }
}

const specialAttribute = (owner, attr) => {
  switch (attr.name) {
    case 'class':
      owner.classList.value = attr.value;
      break;
  }
};

const stringifiedNode = el => {
  switch (el.nodeType) {
    case 1:
      const tag = el.nodeName.toLowerCase();
      return ('<' + tag).concat(
        el.attributes.length ?
          (' ' + el.attributes.map(stringifiedNode).join(' ') + '>') :
          '>',
        el.childNodes.map(stringifiedNode).join(''),
        NO_CLOSING_TAG.test(tag) ?
          '' :
          ('</' + tag + '>')
      );
    case 2:
      return typeof el.value === 'boolean' ?
        (el.value ? el.name : '') :
        (el.name + '="' + escape(el.value) + '"');
    case 3:
      return el.data;
    case 8:
      return '<!--' + el.data + '-->';
  }
};

// interface Element // https://dom.spec.whatwg.org/#interface-element
module.exports = class Element extends Node {
  constructor(ownerDocument, name) {
    super(ownerDocument);
    this.attributes = [];
    this.nodeType = 1;
    this.nodeName = name.toUpperCase();
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
    name = name.toUpperCase();
    for (let i = 0; i < this.children.length; i++) {
      let el = this.children[i];
      if (el.nodeName === name) list.push(el);
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
      attr.value = '';
      specialAttribute(this, attr);
    }
  }

  setAttribute(name, value) {
    const attr = this.getAttributeNode(name);
    if (attr) attr.value = value;
    else {
      const attr = this.ownerDocument.createAttribute(name);
      attr.ownerElement = this;
      this.attributes.push(attr);
      attr.value = value;
    }
  }

  setAttributeNode(attr) {
    const old = this.getAttributeNode(attr.name);
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
        specialAttribute(this, attr);
        return old;
      } else {
        this.attributes.push(attr);
        specialAttribute(this, attr);
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
    this.childNodes.splice(0, this.childNodes.length);
    parse(html).childNodes.forEach(utils.injectNode, this);
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
  }

  get lastElementChild() {
    for (let i = this.childNodes.length; i--;) {
      let child = this.childNodes[i];
      if (child.nodeType === 1) return child;
    }
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
    return this.querySelectorAll(css)[0];
  }

  querySelectorAll(css) {
    return [].concat(...css.split(CSS_SPLITTER).map(findBySelector, this));
  }

};
