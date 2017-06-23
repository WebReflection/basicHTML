require('@webreflection/interface');

const Node = require('./Node');

const CSS_SPLITTER = /\s*,\s*/;

const childrenType = node => node.nodeType === Node.ELEMENT_NODE;

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

// interface ParentNode @ https://dom.spec.whatwg.org/#parentnode
module.exports = Object.interface({

  get children() {
    return this.childNodes.filter(childrenType);
  },

  get firstElementChild() {
    for (let i = 0, length = this.childNodes.length; i < length; i++) {
      let child = this.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) return child;
    }
    return null;
  },

  get lastElementChild() {
    for (let i = this.childNodes.length; i--;) {
      let child = this.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) return child;
    }
    return null;
  },

  get childElementCount() {
    return this.children.length;
  },

  prepend(...nodes) {
    const fragment = this.ownerDocument.createDocumentFragment();
    fragment.childNodes.push(...nodes.map(asNode, this.ownerDocument));
    if (this.childNodes.length) {
      this.insertBefore(fragment, this.firstChild);
    } else {
      this.appendChild(fragment);
    }
  },

  append(...nodes) {
    const fragment = this.ownerDocument.createDocumentFragment();
    fragment.childNodes.push(...nodes.map(asNode, this.ownerDocument));
    this.appendChild(fragment);
  },

  querySelector(css) {
    return this.querySelectorAll(css)[0] || null;
  },

  querySelectorAll(css) {
    return [].concat(...css.split(CSS_SPLITTER).map(findBySelector, this));
  }

});
