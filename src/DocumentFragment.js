const Node = require('./Node');

// interface DocumentFragment // https://dom.spec.whatwg.org/#documentfragment
module.exports = class DocumentFragment extends Node {
  constructor(ownerDocument) {
    super(ownerDocument);
    this.nodeType = 11;
    this.nodeName = '#document-fragment';
  }
};
