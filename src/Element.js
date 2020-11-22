require('@webreflection/interface');

const CSS_SPLITTER = /\s*,\s*/;
const AVOID_ESCAPING = /^(?:script|style)$/i;
const {VOID_ELEMENT, voidSanitizer} = require('./utils');

const escape = require('html-escaper').escape;
const Parser = require('htmlparser2').Parser;
const findName = (Class, registry) => {
  for (let key in registry)
    if (registry[key] === Class)
      return key;
};
const parseInto = (node, html) => {
  const stack = [];
  const document = node.ownerDocument;
  const content = new Parser({
    onopentagname(name) {
      switch (name) {
        /* TODO this actually breaks heresy-ssr
        case 'html':
          node = document.documentElement;
          node.childNodes = [];
          break;
        case 'head':
        case 'body':
          node.replaceChild(document.createElement(name), document[name]);
          node = document[name];
          break;
        */
        default:
          const child = document.createElement(name);
          if (child.isCustomElement) {
            stack.push(node, child);
            node = child;
          }
          else
            node = node.appendChild(child);
          break;
      }
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
      switch (name) {
        default:
          while (stack.length)
            stack.shift().appendChild(stack.shift());
          /* istanbul ignore else */
          if (node.nodeName === name)
            node = node.parentNode;
          break;
      }
    }
  }, {
    decodeEntities: true,
    xmlMode: true
  });
  content.write(voidSanitizer(html));
  content.end();
};

const utils = require('./utils');
const ParentNode = require('./ParentNode');
const ChildNode = require('./ChildNode');
const NamedNodeMap = require('./NamedNodeMap');
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
        VOID_ELEMENT.test(el.nodeName) ?
          ' />' :
          ('>' + (
            AVOID_ESCAPING.test(el.nodeName) ?
              el.textContent :
              el.childNodes.map(stringifiedNode).join('')
          ) + '</' + el.nodeName + '>')
      );
    case Node.ATTRIBUTE_NODE:
      return el.name === 'style' && !el.value ? '' : (
        typeof el.value === 'boolean' || el.value == null ?
          (el.value ? (' ' + el.name) : '') :
          (' ' + el.name + '="' + escape(el.value) + '"')
      );
    case Node.TEXT_NODE:
      return escape(el.data);
    case Node.COMMENT_NODE:
      return '<!--' + el.data + '-->';
  }
};

// interface Element // https://dom.spec.whatwg.org/#interface-element
class Element extends Node.implements(ParentNode, ChildNode) {
  constructor(ownerDocument, name) {
    super(ownerDocument);
    this.attributes = new NamedNodeMap(this);
    this.nodeType = Node.ELEMENT_NODE;
    this.nodeName = name || findName(
      this.constructor,
      this.ownerDocument.customElements._registry
    );
    this.classList = new DOMTokenList(this);
  }

  // it doesn't actually really work as expected
  // it simply provides shadowRoot as the element itself
  attachShadow(init) {
    switch (init.mode) {
      case 'open': return (this.shadowRoot = this);
      case 'closed': return this;
    }
    throw new Error('element.attachShadow({mode: "open" | "closed"})');
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
    if (attr) this.removeAttributeNode(attr);
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

  removeAttributeNode(attr) {
    const i = this.attributes.indexOf(attr);
    if (i < 0) throw new Error('unable to remove ' + attr);
    this.attributes.splice(i, 1);
    attr.value = null;
    delete this.attributes[attr.name];
    specialAttribute(this, attr);
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

  setAttributeNodeNS(attr) {
    return this.setAttributeNode(attr);
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
    this.textContent = '';
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

  get tagName() {
    return this.nodeName
  }

};

module.exports = Element;
