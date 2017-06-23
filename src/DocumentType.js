const Node = require('./Node');

// interface DocumentType // https://dom.spec.whatwg.org/#documenttype
module.exports = class DocumentType extends Node {
  constructor(ownerDocument) {
    super(ownerDocument);
    this.nodeType = Node.DOCUMENT_TYPE_NODE;
    this.name = 'html';
  }

  toString() {
    return '<!DOCTYPE ' + this.name + '>';
  }

};
