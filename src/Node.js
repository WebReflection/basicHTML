const EventTarget = require('./EventTarget');

const nullParent = node => resetParent(null, node);

const removeFromParent = (parentNode, child) => {
  const cn = parentNode.childNodes;
  cn.splice(cn.indexOf(child), 1);
};

const resetParent = (parentNode, node) => {
  if (node.parentNode && node.parentNode !== parentNode) {
    removeFromParent(node.parentNode, node);
  }
  node.parentNode = parentNode;
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
      else resetParent(this, node);
      this.childNodes.push(node);
    }
    return node;
  }

  hasChildNodes() {
    return 0 < this.childNodes.length;
  }

  insertBefore(node, child) {
    if (node.nodeType === 11) {
      node.childNodes.slice().forEach(node => this.insertBefore(node, child));
    } else {
      const i = this.childNodes.indexOf(child);
      resetParent(this, node);
      this.childNodes.splice(i, 0, node);
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
    } else {
      const i = this.childNodes.indexOf(child);
      this.childNodes.splice(i, 1, node);
      nullParent(child);
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
    const parent = this.parentNode;
    return parent ?
      (parent.childNodes[parent.indexOf(this) + 1] || null) :
      null;
  }

  get previousSibling() {
    const parent = this.parentNode;
    return parent ?
      (parent.childNodes[parent.indexOf(this) - 1] || null) :
      null;
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
