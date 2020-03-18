require('@webreflection/interface');

const Node = require('./Node');
const ParentNode = require('./ParentNode');
const ChildNode = require('./ChildNode');
const Extend = Node.implements(ParentNode, ChildNode);

// interface DocumentFragment // https://dom.spec.whatwg.org/#documentfragment
module.exports = class DocumentFragment extends Extend {

  constructor(ownerDocument) {
    super(ownerDocument);
    this.nodeType = Node.DOCUMENT_FRAGMENT_NODE;
    this.nodeName = '#document-fragment';
  }

};
