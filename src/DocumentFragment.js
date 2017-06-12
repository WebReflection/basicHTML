const Node = require('./Node');

module.exports = class DocumentFragment extends Node {
  constructor(ownerDocument) {
    super(ownerDocument);
    this.nodeType = 11;
    this.nodeName = '#document-fragment';
  }
};
