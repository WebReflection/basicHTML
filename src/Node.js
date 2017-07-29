const utils = require('./utils');
const EventTarget = require('./EventTarget');

const nullParent = node => resetParent(null, node);

const removeFromParent = (parentNode, child) => {
  const cn = parentNode.childNodes;
  cn.splice(cn.indexOf(child), 1);
  utils.disconnect(parentNode, child);
};

const resetParent = (parentNode, child) => {
  if (child.parentNode) {
    removeFromParent(child.parentNode, child);
  }
  if ((child.parentNode = parentNode)) {
    utils.connect(parentNode, child);
  }
};

const stringifiedContent = el => {
  switch(el.nodeType) {
    case Node.ELEMENT_NODE:
    case Node.DOCUMENT_FRAGMENT_NODE: return el.textContent;
    case Node.TEXT_NODE: return el.data;
    default: return '';
  }
};

// interface Node : EventTarget // https://dom.spec.whatwg.org/#node
class Node extends EventTarget {

  constructor(ownerDocument) {
    super();
    this.ownerDocument = ownerDocument || global.document;
    this.childNodes = [];
  }

  appendChild(node) {
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      node.childNodes.slice().forEach(this.appendChild, this);
    } else {
      const i = this.childNodes.indexOf(node);
      if (-1 < i) this.childNodes.splice(i, 1);
      this.childNodes.push(node);
      if (i < 0) resetParent(this, node);
    }
    return node;
  }

  cloneNode(deep) {
    let node;
    const document = this.ownerDocument;
    switch (this.nodeType) {
      case Node.ATTRIBUTE_NODE:
        node = document.createAttribute(this.name);
        node.value = this.value;
        return node;
      case Node.TEXT_NODE:
        return document.createTextNode(this.data);
      case Node.COMMENT_NODE:
        return document.createComment(this.data);
      case Node.ELEMENT_NODE:
        node = document.createElement(this.nodeName);
        this.attributes.forEach(a => node.setAttribute(a.name, a.value));
      case Node.DOCUMENT_FRAGMENT_NODE:
        if (!node) node = document.createDocumentFragment();
        if (deep)
          this.childNodes.forEach(c => node.appendChild(c.cloneNode(deep)));
        return node;
    }
  }

  hasChildNodes() {
    return 0 < this.childNodes.length;
  }

  insertBefore(node, child) {
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      node.childNodes.slice().forEach(node => this.insertBefore(node, child));
    } else if (node !== child) {
      if (child) {
        const i = this.childNodes.indexOf(child);
        this.childNodes.splice(i, 0, node);
      } else {
        this.childNodes.push(node);
      }
      resetParent(this, node);
    }
    return node;
  }

  removeChild(child) {
    nullParent(child);
    return child;
  }

  replaceChild(node, child) {
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      this.insertBefore(node, child);
      this.removeChild(child);
    } else if (node !== child) {
      const i = this.childNodes.indexOf(child);
      this.childNodes.splice(i, 0, node);
      nullParent(child);
      resetParent(this, node);
    }
    return child;
  }

  get firstChild() {
    return this.childNodes[0];
  }

  get lastChild() {
    return this.childNodes[this.childNodes.length - 1];
  }

  get nextSibling() {
    if (this.parentNode) {
      const cn = this.parentNode.childNodes;
      return cn[cn.indexOf(this) + 1] || null;
    }
    return null;
  }

  get previousSibling() {
    if (this.parentNode) {
      const cn = this.parentNode.childNodes;
      return cn[cn.indexOf(this) - 1] || null;
    }
    return null;
  }

  get textContent() {
    switch (this.nodeType) {
      case Node.ELEMENT_NODE:
      case Node.DOCUMENT_FRAGMENT_NODE:
        return this.childNodes.map(stringifiedContent).join('');
      case Node.ATTRIBUTE_NODE:
        return this.value;
      case Node.TEXT_NODE:
      case Node.COMMENT_NODE:
        return this.data;
      default: return null;
    }
  }

  set textContent(text) {
    switch (this.nodeType) {
      case Node.ELEMENT_NODE:
      case Node.DOCUMENT_FRAGMENT_NODE:
        this.childNodes.forEach(nullParent);
        if (text) {
          const node = this.ownerDocument.createTextNode(text);
          node.parentNode = this;
          this.childNodes.push(node);
        }
        break;
      case Node.ATTRIBUTE_NODE:
        this.value = text;
        break;
      case Node.TEXT_NODE:
      case Node.COMMENT_NODE:
        this.data = text;
        break;
    }
  }

};

Object.keys(utils.types).forEach(type => Node[type] = utils.types[type]);

module.exports = Node;
