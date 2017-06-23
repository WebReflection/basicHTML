require('@webreflection/interface');

const Node = require('./Node');
const ParentNode = require('./ParentNode');

// interface DocumentFragment // https://dom.spec.whatwg.org/#documentfragment
module.exports = class DocumentFragment extends Node.implements(ParentNode) {

  constructor(ownerDocument) {
    super(ownerDocument);
    this.nodeType = Node.DOCUMENT_FRAGMENT_NODE;
    this.nodeName = '#document-fragment';
  }

};
