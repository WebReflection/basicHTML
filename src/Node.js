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
    case 1:
    case 11: return el.textContent;
    case 3: return el.data;
    default: return '';
  }
};

// interface Node : EventTarget // https://dom.spec.whatwg.org/#node
module.exports = class Node extends EventTarget {

  constructor(ownerDocument) {
    super();
    this.ownerDocument = ownerDocument;
    this.childNodes = [];
  }

  appendChild(node) {
    if (node.nodeType === 11) {
      node.childNodes.slice().forEach(this.appendChild, this);
    } else {
      const i = this.childNodes.indexOf(node);
      if (-1 < i) this.childNodes.splice(i, 1);
      this.childNodes.push(node);
      if (i < 0) resetParent(this, node);
    }
    return node;
  }

  hasChildNodes() {
    return 0 < this.childNodes.length;
  }

  insertBefore(node, child) {
    if (node.nodeType === 11) {
      node.childNodes.slice().forEach(node => this.insertBefore(node, child));
    } else if (node !== child) {
      const i = this.childNodes.indexOf(child);
      this.childNodes.splice(i, 0, node);
      resetParent(this, node);
    }
    return node;
  }

  removeChild(child) {
    nullParent(child);
    return child;
  }

  replaceChild(node, child) {
    if (node.nodeType === 11) {
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
      case 1:
      case 11: return this.childNodes.map(stringifiedContent).join('');
      case 2: return this.value;
      case 3:
      case 8: return this.data;
      default: return null;
    }
  }

  set textContent(text) {
    switch (this.nodeType) {
      case 1:
      case 11:
        this.childNodes.forEach(nullParent);
        if (text) {
          const node = this.ownerDocument.createTextNode(text);
          node.parentNode = this;
          this.childNodes.push(node);
        }
        break;
      case 2:
        this.value = text;
        break;
      case 3:
      case 8:
        this.data = text;
        break;
    }
  }

};
