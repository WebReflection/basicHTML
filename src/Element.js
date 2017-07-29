require('@webreflection/interface');

const CSS_SPLITTER = /\s*,\s*/;

const escape = require('html-escaper').escape;
const Parser = require('htmlparser2').Parser;
const findName = (Class, registry) => {
  for (let key in registry)
    if (registry[key] === Class)
      return key;
};
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
    onclosetag() {
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
const ParentNode = require('./ParentNode');
const Node = require('./Node');
const DOMTokenList = require('./DOMTokenList');

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
    case Node.ELEMENT_NODE:
      return ('<' + el.nodeName).concat(
        el.attributes.map(stringifiedNode).join(''),
        Element.VOID_ELEMENT.test(el.nodeName) ?
          '/>' :
          ('>' + el.childNodes.map(stringifiedNode).join('') + '</' + el.nodeName + '>')
      );
    case Node.ATTRIBUTE_NODE:
      return typeof el.value === 'boolean' ?
        (el.value ? (' ' + el.name) : '') :
        (' ' + el.name + '="' + escape(el.value || '') + '"');
    case Node.TEXT_NODE:
      return el.data;
    case Node.COMMENT_NODE:
      return '<!--' + el.data + '-->';
  }
};

// interface Element // https://dom.spec.whatwg.org/#interface-element
class Element extends Node.implements(ParentNode) {
  constructor(ownerDocument, name) {
    super(ownerDocument);
    this.attributes = [];
    this.nodeType = Node.ELEMENT_NODE;
    this.nodeName = name || findName(
      this.constructor,
      this.ownerDocument.customElements._registry
    );
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
    } while ((el = el.parentNode) && el.nodeType === Node.ELEMENT_NODE);
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
      delete this.attributes[name];
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
      this.attributes[name] = attr;
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
      this.attributes[name] = attr;
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

  get nextElementSibling() {
    const children = this.parentNode.children;
    let i = children.indexOf(this);
    return ++i < children.length ? children[i] : null;
  }

  get previousElementSibling() {
    const children = this.parentNode.children;
    let i = children.indexOf(this);
    return --i < 0 ? null : children[i];
  }

  get outerHTML() {
    return stringifiedNode(this);
  }

};

Element.VOID_ELEMENT = /^area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr$/i;

module.exports = Element;
